import OpenAI from "openai";
import { toFile } from "openai/uploads";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function loadReferenceImage(relativePath: string) {
  const fullPath = path.join(process.cwd(), "public", relativePath);
  const buffer = fs.readFileSync(fullPath);

  return await toFile(buffer, path.basename(fullPath), {
    type: "image/png",
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const petImage = formData.get("image") as File;
    const product = formData.get("product") as string;
    const style = formData.get("style") as string;

    if (!petImage) {
      return Response.json({ error: "Aucune image reçue." }, { status: 400 });
    }

    const petBuffer = Buffer.from(await petImage.arrayBuffer());

    const petFile = await toFile(petBuffer, "pet.png", {
      type: petImage.type || "image/png",
    });

    const hFile = await loadReferenceImage(
      "references/tshirt/royal/htshirt.png"
    );

    const prompt = `
Use image 2 as the base product photograph.

Image 1 is the uploaded pet reference.
Image 2 is the final t-shirt model photo.

Create one premium ecommerce product preview:
- Keep the person, pose, background, lighting and composition from image 2.
- Transform the pet from image 1 into a ${style} character.
- Place the transformed pet as a realistic printed design on the t-shirt.
- Preserve the pet identity: fur color, markings, eyes, ears, muzzle and expression.
- The print must look integrated into the fabric, not pasted.
- Premium fashion campaign look.
- No text, no logo, no watermark.
`;

    const result = await openai.images.edit({
      model: "gpt-image-1",
      image: [petFile, hFile],
      prompt,
      size: "1024x1024",
      quality: "medium",
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      return Response.json(
        { error: "Aucune image générée." },
        { status: 500 }
      );
    }

    const designId = `design-${Date.now()}`;

    return Response.json({
      clientImage: `data:image/png;base64,${imageBase64}`,
      designId,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Erreur pendant la génération." },
      { status: 500 }
    );
  }
}