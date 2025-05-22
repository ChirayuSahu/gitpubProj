import { connectMongo } from "@/utils/connectMongo";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/user";
import { hashPass } from "@/lib/encrypt";
import { sanitizeFilter } from "mongoose";


export const POST = async (req: NextRequest) => {
    
    const { name, username, email, password } = await req.json();

    if (!name || !username || !email || !password) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    if(username.includes(" ")) {
        return NextResponse.json({ message: "Username cannot contain spaces." }, { status: 400 });
    }
    
    if(!username.match(/^[a-zA-Z0-9_]+$/)) {
        return NextResponse.json({ message: "Username can only contain letters, numbers, and underscores." }, { status: 400 });
    }

    if(!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return NextResponse.json({ message: "Invalid email address." }, { status: 400 });
    }

    const hashedPass = await hashPass(password);

    try {

        await connectMongo();

        const existingEmail = await User.findOne(sanitizeFilter({ email }));

        if (existingEmail) {
            return NextResponse.json({message: "Email already exists."}, {status: 400});
        }

        const existingUsername = await User.findOne(sanitizeFilter({ username }));

        if(existingUsername) {
            return NextResponse.json({message: "Username already exists."}, {status: 400});
        }

        const user = await User.create(sanitizeFilter({
            name,
            username,
            email,
            password: hashedPass,
        }));
        
        user.save();

        return NextResponse.json({message: "User created successfully."}, {status: 201});


    } catch (error:any) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}   