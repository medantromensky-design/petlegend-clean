import OpenAI from "openai";
import { toFile } from "openai/uploads";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
      "references/poster/royal/hposter.png"
    );

    const prompt = `
                      You are creating a premium e-commerce product visualization.

IMAGE 1:
The pet photo. This is the identity reference.

IMAGE 2:
A home interior poster mockup. This is only a placement reference.

IMPORTANT:

Do NOT use IMAGE 2 as a style reference.

Do NOT copy its artistic style.

Do NOT use its colors, lighting, artwork, or visual design as inspiration for the portrait.

Use IMAGE 2 only to determine where the final artwork should appear inside the poster frame.

Create a spectacular luxury Royal portrait of the pet from IMAGE 1.

The pet must remain instantly recognizable.

Preserve exactly:
- fur color
- fur markings
- eye color
- muzzle shape
- ear shape
- facial proportions
- expression
- distinctive traits

The pet should appear as a noble royal figure in a timeless fine-art portrait.

Museum-quality artwork.

Luxury gallery quality.

Ultra realistic.

Extraordinary fur detail.

Rich velvet fabrics.

Elegant royal clothing.

Subtle gold embroidery.

Refined aristocratic styling.

Powerful and emotional presence.

Prestigious and timeless atmosphere.

Cinematic lighting.

Masterpiece-level execution.

The portrait must feel worthy of a luxury art gallery, private collection, or premium hotel.

After creating the royal portrait, place it naturally inside the poster frame shown in IMAGE 2.

The poster must appear physically present within the room.

Respect the frame position, perspective, scale, depth, lighting, reflections, shadows, and viewing angle from IMAGE 2.

The artwork should look professionally printed and realistically mounted inside the frame.

The final image should look like a real premium poster displayed in a high-end interior.

The viewer should immediately think:
"I want this poster in my home."

Avoid:
cartoon,
caricature,
humor,
kitsch,
cheap costume appearance,
generic animal face,
breed alteration,
eye color changes,
fur color changes,
facial distortion,
text,
logo,
watermark,
signature,
fantasy exaggeration.
The royal portrait should be the visual focal point of the room.

The viewer's eye must be immediately drawn to the artwork before noticing the surrounding interior.
The artwork should look expensive, collectible, and professionally designed, as if sold by a luxury premium art brand.
`;

    const result = await openai.images.edit({
      model: "gpt-image-2",
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

    const imageUrl = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBase64}`,
      {
        public_id: designId,
        folder: "petlegend",
        resource_type: "image",
      }
    );

    return Response.json({
      clientImage: `data:image/png;base64,${imageBase64}`,
      designId,
      imageUrl: imageUrl.secure_url,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Erreur pendant la génération." },
      { status: 500 }
    );
  }
}