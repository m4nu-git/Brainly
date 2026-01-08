import express from "express";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import bcrypt from "bcrypt";
import z from "zod";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {
  const signupInputSchema = z.object({
    username: z
      .string()
      .min(3, { message: "min 3 letters" })
      .max(10, { message: "max 10 letters" }),
    password: z
      .string()
      .min(8, { message: "min 8 letters" })
      .max(20, { message: "max 20 letters" })
      .regex(/\W/, { message: "must contain a special character" })
      .regex(/[A-Z]/, { message: "must contain an uppercase letter" })
      .regex(/[a-z]/, { message: "must contain a lowercase letter" }),
  });

  const validInputs = signupInputSchema.safeParse(req.body);

  if (!validInputs.success) {
    const errorMessage = validInputs.error.errors.map((e) => e.message);
    res.status(411).json({
      message: "invalid format",
      error: errorMessage,
    });
    return;
  }

  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 7);

  try {
    const existingUser = await UserModel.findOne({
      username,
    });
    if (!existingUser) {
      await UserModel.create({
        username: username,
        password: hashedPassword,
      });
      res.status(200).json({
        message: "User created Successfully",
      });
    } else {
      res.status(403).json({
        warning: "Username Already taken",
      });
    }
  } catch (error) {
    console.log(`Error during signup ${error}`);
    res.status(500).json({
      warning: `Error Occured while creating a user`,
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {

  const { username, password } = req.body;

  const existingUser = await UserModel.findOne({
    username,
  });


  if (!existingUser) {
    res.status(403).json({
      warning: `User doesn't exist`,
    });
  }
  if (existingUser === null) {
    return;
  }
  if (existingUser.password) {
    try {
      const hashedPassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (hashedPassword) {
        if (existingUser._id) {
          const token = jwt.sign(
            { id: existingUser._id,
              username: existingUser.username,
             },
            process.env.JWT_SECRET as string
          );
          res.status(200).json({
            message: "User Signed in Successfully",
            username: existingUser.username,
            token: token,
          });
        }
      } else {
        res.status(403).json({
          warning: `Wrong Password`,
        });
      }
    } catch (e) {
      res.status(400).json({
        warning: `Intarnal server error Occured!`,
      });
    }
  } else {
    res.json({
      warning: `Password not set for this User`,
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const { link, title, type } = req.body;

  try {
    await ContentModel.create({
      title: title,
      type: type,
      link: link,
      tags: [],
      userId: req.userId,
    });
    res.status(200).json({
      message: "Content added successfully",
    });
  } catch (e) {
    console.log(`Error occured ${e}`);
    res.status(401).json({
      warning: "error occured while adding content",
    });
  }
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId", "username");
  res.json({
    content,
  });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  await ContentModel.deleteMany({
    contentId,
    userId: req.userId,
  });

  res.json({
    message: "Deleted",
  });
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share;

  if (share) {
    const existingLink = await LinkModel.findOne({
      userId: req.userId,
    });

    if (existingLink) {
      res.json({
        hash: existingLink.hash,
      });
      return;
    }

    const hash = random(10);
    await LinkModel.create({
      userId: req.userId,
      hash: hash,
    });

    res.json({
      hash,
    });
  } else {
    await LinkModel.deleteOne({
      userId: req.userId,
    });
    res.json({
      message: "Removed link",
    });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  const link = await LinkModel.findOne({
    hash,
  });

  if (!link) {
    res.status(411).json({
      message: "Sorry incorrect input",
    });
    return;
  }

  // userId
  const content = await ContentModel.find({
    userId: link.userId,
  });

  console.log(link);
  const user = await UserModel.findOne({
    _id: link.userId,
  });

  if (!user) {
    res.status(411).json({
      message: "user not found, error should ideally not happen",
    });
    return;
  }

  res.json({
    username: user.username,
    content: content,
  });
});

app.listen(3000);
