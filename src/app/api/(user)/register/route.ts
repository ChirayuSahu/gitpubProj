import { connectMongo } from "@/utils/connectMongo";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/user";
import { hashPass } from "@/lib/encrypt";


export const POST = async (req: NextRequest) => {
    
    const { name, username, email, password } = await req.json();

    if (!name || !username || !email || !password) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const hashedPass = await hashPass(password);

    try {

        await connectMongo();

        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return NextResponse.json({message: "Email already exists."}, {status: 400});
        }

        const existingUsername = await User.findOne({ username });

        if(existingUsername) {
            return NextResponse.json({message: "Username already exists."}, {status: 400});
        }

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPass,
        })
        
        user.save();

        return NextResponse.json({message: "User created successfully."}, {status: 201});


    } catch (error:any) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}   