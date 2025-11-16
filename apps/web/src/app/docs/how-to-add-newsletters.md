# 📄 How to Add a New Newsletter  
This guide explains how to add a new newsletter to the Opensox platform using the **updated newsletter data structure**, where:

- **Metadata** → lives in `apps/web/src/data/newsletters.ts`  
- **Content (Markdown)** → lives in  
  `apps/web/src/app/content/newsletters/[slug].md`

---

## 🗂 Folder Structure

\`\`\`
apps/web/src/
├── app/
│   └── content/
│       └── newsletters/
│           ├── getting-started-with-nextjs.md
│           ├── understanding-typescript.md
│           └── mastering-react-hooks.md
└── data/
    └── newsletters.ts
\`\`\`

---

## ✅ Step 1: Add Your Markdown Content

Create a new file inside:

\`\`\`
apps/web/src/app/content/newsletters/
\`\`\`

Example:

\`\`\`
my-awesome-guide.md
\`\`\`

Inside it, write your Markdown content:

\`\`\`md
# My Awesome Guide

Here is the content of my newsletter...

- Introduction  
- Key points  
- Summary  

Happy reading!
\`\`\`

---

## ✅ Step 2: Add Metadata in `newsletters.ts`

Open:

\`\`\`
apps/web/src/data/newsletters.ts
\`\`\`

Add a new object inside the `posts` array.

Example:

\`\`\`ts
import photo from '../assets/images/photu.jpg';
import coverimg from '../assets/images/gsoc.png';
import { StaticImageData } from 'next/image';

export interface Post {
  date: string;
  heading: string;
  description: string;
  image: StaticImageData;
  coverimg: StaticImageData;
  slug: string;
}

export const posts: Post[] = [
  {
    date: "2024-05-01",
    heading: "My Awesome Guide",
    description:
      "A walkthrough of an important topic, broken down into simple concepts and examples.",
    image: photo,
    coverimg: coverimg,
    slug: "my-awesome-guide",
  },
];
\`\`\`

### 🔥 Important:

- `slug` **must match the markdown filename**  
  Example:  
  `slug: "my-awesome-guide"` → file must be:  
  `my-awesome-guide.md`
- `image` → small card image  
- `coverimg` → large header image  
- `date` → `"YYYY-MM-DD"` format

---

## ✅ Step 3: Add Images (If Needed)

Place images in:

\`\`\`
apps/web/src/assets/images/
\`\`\`

Then import in `newsletters.ts`:

\`\`\`ts
import img from '../assets/images/myimage.webp';
\`\`\`

---

## 🎉 Done!
You've successfully added a new newsletter using the updated structure.
