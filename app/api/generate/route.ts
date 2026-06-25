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

    const prompts: Record<string, string> = {
      "Mafia Boss": `
    You are creating a premium e-commerce poster visualization.

IMAGE 1:
The pet photo. This is the identity reference and must be preserved.

IMAGE 2:
A poster mockup displayed inside a home interior. This is only a placement reference.

PRIMARY GOAL:

Create a premium mafia boss portrait of the pet from IMAGE 1.

The portrait quality is more important than the room, furniture, or poster mockup.

The final artwork should feel worthy of a luxury art gallery, private collection, or five-star hotel.

IDENTITY PRESERVATION (CRITICAL):

The pet must remain instantly recognizable.

The pet's unique identity must be faithfully recreated from IMAGE 1 while allowing natural variations in head orientation, gaze direction, facial expression, and pose.

Identity preservation is the highest priority of the entire generation. The pet must remain instantly recognizable even when viewed from a different angle than the reference image.

The portrait must look like the same individual animal, not merely the same breed.

Preserve accurately:

fur color

fur markings

eye color

muzzle shape

ear shape

overall facial identity

distinctive breed traits

Do not create a generic animal.

NATURAL ANIMAL PORTRAITURE:
The pet must be portrayed as a complete, anatomically coherent animal naturally occupying the scene.
The portrait must not resemble a human body with an animal head attached.
The neck, shoulders, chest, and body must connect naturally and believably.
The pet may be viewed from a different angle than the reference image, including frontal, three-quarter, or profile views.
The head may be turned, tilted, raised, lowered, or repositioned naturally.
The final artwork should feel like a genuine royal portrait of the animal itself rather than a human royal portrait with the pet's face pasted onto it.


MAFIA ART DIRECTION:
Inspired by classic Italian mafia cinema, luxury crime dramas, and high-end editorial photography.
The pet is portrayed as a powerful and respected mafia boss at the peak of his influence.
Seated confidently behind a massive mahogany desk in a luxurious private office.
Impeccably tailored black three-piece suit, silk tie, pocket square, gold cufflinks, and luxury watch.
Rich dark wood, leather furniture, crystal decanters, subtle cigar smoke, and warm ambient lighting.
Expression of calm authority, intelligence, and absolute confidence.
Sophisticated, wealthy, and intimidating without appearing aggressive.
Cinematic lighting, dramatic shadows, shallow depth of field, premium color grading, and ultra-realistic detail.
Museum-quality portraiture, luxury magazine photography, and award-winning cinematic realism.
No comedy, no parody, no cartoon style, no exaggerated gangster stereotypes.

POSTER INTEGRATION:

After creating the portrait, place the artwork inside the poster frame shown in IMAGE 2.

Use IMAGE 2 only for:

frame position

perspective

scale

viewing angle

room placement


Do not copy the artistic style of IMAGE 2.

The poster should appear physically present in the room.

The print should look professionally produced, framed, mounted, and displayed.

The artwork must remain the visual focal point of the scene.

The portrait artwork should occupy approximately 80–90% of the visible poster area.

The room environment must remain secondary and visually subdued.

The viewer's eye should be drawn first to the portrait, then to the room.

AVOID:

Cartoon style,
Anime style,
Illustration style,
Low-quality rendering,
Blurry details,
Generic animal face,
Identity drift from IMAGE 1,
Funny or comedic expressions,
Smiling excessively,
Meme aesthetics,
Parody mafia stereotypes,
Cheap costumes,
Oversized accessories,
Exaggerated gangster clichés,
Weapons as the main focus,
Modern street gang aesthetics,
Bright neon colors,
Overly saturated colors,
Harsh flash photography,
Distorted anatomy,
Extra limbs,
Cropped ears,
Cropped muzzle,
Visible text,
Watermarks,
Logos,
Frame within frame,
Low resolution,
Poor lighting,
Cluttered background.

The final result should feel like a luxury premium poster sold by a high-end art brand.
    `,

      Imperial: `
    You are creating a premium e-commerce poster visualization.

IMAGE 1:
The pet photo. This is the identity reference and must be preserved.

IMAGE 2:
A poster mockup displayed inside a home interior. This is only a placement reference.

PRIMARY GOAL:

Create an extraordinary imperial portrait of the pet from IMAGE 1.

The portrait quality is more important than the room, furniture, or poster mockup.

The final artwork should feel worthy of a luxury art gallery, private collection, or five-star hotel.

IDENTITY PRESERVATION (CRITICAL):

The pet must remain instantly recognizable.

The pet's unique identity must be faithfully recreated from IMAGE 1 while allowing natural variations in head orientation, gaze direction, facial expression, and pose.

Identity preservation is the highest priority of the entire generation. The pet must remain instantly recognizable even when viewed from a different angle than the reference image.

The portrait must look like the same individual animal, not merely the same breed.

Preserve accurately:

fur color

fur markings

eye color

muzzle shape

ear shape

overall facial identity

distinctive breed traits

Do not create a generic animal.

NATURAL ANIMAL PORTRAITURE:
The pet must be portrayed as a complete, anatomically coherent animal naturally occupying the scene.
The portrait must not resemble a human body with an animal head attached.
The neck, shoulders, chest, and body must connect naturally and believably.
The pet may be viewed from a different angle than the reference image, including frontal, three-quarter, or profile views.
The head may be turned, tilted, raised, lowered, or repositioned naturally.
The final artwork should feel like a genuine royal portrait of the animal itself rather than a human royal portrait with the pet's face pasted onto it.
The pet must remain instantly recognizable while allowing realistic pose variation and natural anatomical integration.

IMPERIAL ART DIRECTION:

The pet is dressed exactly as Napoleon I in Ingres' Imperial Throne portrait. A monumental crimson velvet imperial robe completely envelops the body from neck to floor. The robe is closed at the front and richly embroidered with gold imperial bees. Over the robe rests a large circular white ermine shoulder mantle trimmed with gold embroidery and black ermine markings. The ermine mantle covers the shoulders and upper chest, creating the iconic layered silhouette of the original painting. No open cape, no flowing cloak, no visible torso beneath the robe.The pet wears an ancient golden laurel wreath crown inspired by Roman emperors, symbolizing imperial authority and victory. Hanging from the chest is an ornate gold chain of the Imperial Order, featuring an elaborate jeweled medallion.
The throne is crafted from carved gold and precious materials, covered with imperial red velvet and decorated with intricate Napoleonic motifs. Beside the throne stand the imperial scepter and the Hand of Justice, both made of gold and adorned with jewels and symbolic imperial ornamentation.
The overall appearance is extraordinarily luxurious, majestic, ceremonial, and regal, conveying absolute imperial power, wealth, prestige, and divine authority.
Tightly cropped imperial portrait, framed from the upper chest upward, focusing on the face, shoulders, ermine collar, laurel crown, and upper throne. The lower body, paws, legs, arms, and hands are completely outside the frame.
Bust-length imperial portrait. Only the head, neck, shoulders, imperial collar, and upper throne are visible.
heavy crimson velvet, luxurious white ermine fur, hand-embroidered gold thread, intricate gold brocade, rich silk fabrics, jeweled gold ornaments, precious gemstones, museum-quality textile detail, ultra-realistic fabric textures.
hundreds of embroidered imperial bees, golden laurel motifs, fleur-de-lis inspired ornamentation, elaborate Napoleonic heraldry, intricate baroque embroidery, ceremonial imperial decorations.
ancient Roman-style golden laurel wreath, individually sculpted laurel leaves, aged gold finish, subtle jewel embellishments, imperial victory crown.
massive gold chain of the Legion of Honour, jeweled imperial medallion, ceremonial decorations, precious gemstones, royal insignia, imperial regalia.
imperial palace interior, absolute imperial authority, divine monarchy symbolism, breathtaking grandeur, majestic presence, aristocratic elegance, supreme ruler aura.
every gold ornament shows realistic reflections and subtle wear consistent with priceless historical regalia.
The silhouette must match the original Ingres painting, with the large circular white ermine mantle dominating the upper body and the crimson imperial robe appearing as a continuous closed garment rather than an open cape.

POSTER INTEGRATION:

After creating the portrait, place the artwork inside the poster frame shown in IMAGE 2.

Use IMAGE 2 only for:

frame position

perspective

scale

viewing angle

room placement


Do not copy the artistic style of IMAGE 2.

The poster should appear physically present in the room.

The print should look professionally produced, framed, mounted, and displayed.

The artwork must remain the visual focal point of the scene.

The portrait artwork should occupy approximately 80–90% of the visible poster area.

The room environment must remain secondary and visually subdued.

The viewer's eye should be drawn first to the portrait, then to the room.

AVOID:

cartoon,
caricature,
humor,
kitsch,
cheap costume design,
generic animal face,
breed alteration,
eye color changes,
fur color changes,
facial distortion,
text,
logo,
watermark,
signature,
fantasy exaggeration,
extra limbs,
duplicated features,
misaligned eyes,
unnatural anatomy,
artificial fur texture,
overly stylized rendering,
low-detail face,
visible paws, 
visible feet, 
visible claws, 
visible legs, 
visible limbs, 
human hands, 
human fingers, 
human arms, 
human anatomy, 
humanoid body structure, 
anthropomorphic features, 
standing on two legs, 
human posture, 
human proportions, 
human facial expressions, 
costume mascot appearance, 
cartoon style, 
caricature, 
exaggerated features, 
generic dog face, 
inaccurate facial markings, 
altered fur color, 
altered eye color, 
modern clothing, 
military uniform, 
low-quality embroidery, 
plastic-looking materials, 
simplified throne, 
cropped crown, 
cropped regalia, 
blurry details, 
distorted anatomy, 
extra limbs, 
extra paws, 
deformed paws, 
awkward pose, 
goofy expression, 
open cape, 
open cloak, 
parted robe, 
visible legs,
smiling human-like expression.

The final result should feel like a luxury premium poster sold by a high-end art brand.
    `,

      Elfique: `
    You are creating a premium e-commerce poster visualization.

IMAGE 1:
The pet photo. This is the identity reference and must be preserved.

IMAGE 2:
A poster mockup displayed inside a home interior. This is only a placement reference.

PRIMARY GOAL:

Create an extraordinary elven portrait of the pet from IMAGE 1.

The portrait quality is more important than the room, furniture, or poster mockup.

The final artwork should feel worthy of a luxury art gallery, private collection, or five-star hotel.

IDENTITY PRESERVATION (CRITICAL):

The pet must remain instantly recognizable.

The pet's unique identity must be faithfully recreated from IMAGE 1 while allowing natural variations in head orientation, gaze direction, facial expression, and pose.

Identity preservation is the highest priority of the entire generation. The pet must remain instantly recognizable even when viewed from a different angle than the reference image.

The portrait must look like the same individual animal, not merely the same breed.

Preserve accurately:

fur color

fur markings

eye color

muzzle shape

ear shape

overall facial identity

distinctive breed traits

Do not create a generic animal.

NATURAL ANIMAL PORTRAITURE:
The pet must be portrayed as a complete, anatomically coherent animal naturally occupying the scene.
The portrait must not resemble a human body with an animal head attached.
The neck, shoulders, chest, and body must connect naturally and believably.
The pet may be viewed from a different angle than the reference image, including frontal, three-quarter, or profile views.
The head may be turned, tilted, raised, lowered, or repositioned naturally.
The final artwork should feel like a genuine royal portrait of the animal itself rather than a human royal portrait with the pet's face pasted onto it.
The pet must remain instantly recognizable while allowing realistic pose variation and natural anatomical integration.


ELVEN ART DIRECTION

Inspired by European fairy tales, enchanted forests, elven kingdoms, magical nature, ancient woodland legends, and high fantasy worlds.
The pet is portrayed as a noble elven being living within an enchanted forest realm.
Surrounded by ancient trees, luminous flowers, glowing plants, mystical woodland light, and timeless natural magic.
Elegant elven attire crafted from luxurious fabrics, intricate embroidery, precious gemstones, natural motifs, and refined fantasy craftsmanship.
Graceful, noble, mystical, and timeless presence.
Soft golden sunlight filtering through the forest canopy, creating a dreamlike and enchanting atmosphere.
Delicate magical details integrated naturally into the environment rather than overwhelming visual effects.
Preserve the original ear shape from IMAGE 1 exactly. Do not add elf ears, pointed ears, elongated ears, human-like ears, or any fantasy ear modifications.
The scene should evoke wonder, serenity, wisdom, beauty, and ancient magic.
Luxurious fantasy realism, cinematic lighting, extraordinary detail, storybook atmosphere, and museum-quality artwork.

POSTER INTEGRATION:

After creating the portrait, place the artwork inside the poster frame shown in IMAGE 2.

Use IMAGE 2 only for:

frame position

perspective

scale

viewing angle

room placement


Do not copy the artistic style of IMAGE 2.

The poster should appear physically present in the room.

The print should look professionally produced, framed, mounted, and displayed.

The artwork must remain the visual focal point of the scene.

The portrait artwork should occupy approximately 80–90% of the visible poster area.

The room environment must remain secondary and visually subdued.

The viewer's eye should be drawn first to the portrait, then to the room.

AVOID:
cartoon, anime, manga, chibi, comic book style, illustration, drawing, sketch, painting texture, watercolor, low-poly, 3D game asset, toy-like appearance, CGI look, stylized animal, generic animal, altered facial identity, breed changes, inaccurate fur markings, inaccurate eye color, unrealistic facial proportions
low resolution, blurry, soft focus, pixelation, compression artifacts, noise, grain, overprocessed image, oversharpening
exaggerated fantasy elements, excessive magic effects, excessive glowing particles, overwhelming visual effects, neon colors, sci-fi elements, futuristic elements, cyberpunk elements
modern clothing, modern accessories, modern architecture, modern furniture, contemporary objects
horror, dark fantasy, evil appearance, sinister expression, demonic elements, monsters, grotesque features, undead themes
funny costume, parody, meme aesthetic, humorous expression, silly appearance, caricature
poor anatomy, distorted anatomy, deformed face, asymmetrical eyes, malformed ears, extra limbs, missing limbs, duplicated features, mutated features
visible human hands, visible human arms, human body parts, anthropomorphic body structure
visible paws holding objects, paws gripping objects, paws resting on armrests, paws placed on furniture
full-body composition, wide shot, distant subject, small subject in frame
cropped ears, cropped crown, cropped face, cropped top of head
busy background, cluttered composition, distracting elements
cheap costume appearance, synthetic fabrics, plastic-looking jewelry, costume-shop aesthetic
flat lighting, harsh flash lighting, overexposed highlights, underexposed shadows
aggressive expression, angry expression, open mouth panting, tongue out, goofy expression
multiple animals, additional animals, background animals
text, captions, watermarks, logos, signatures, borders, frames
visible front paws, visible rear paws, visible legs, visible feet, paw pads, claws, standing pose, walking pose, sitting pose showing paws, limbs visible below the chest, full-body animal portrait
throne, royal throne, crown jewels, royal regalia, scepter, imperial clothing, king, queen, emperor, medieval monarch, palace interior, royal court, military uniform
fairy wings, butterfly wings, insect wings, tiny wings, pixie wings, tinkerbell aesthetic
The final result should feel like a luxury premium poster sold by a high-end art brand.
    `,
    };

    const prompt = prompts[style] || prompts["Mafia Boss"];    

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