import { connectMongo } from "@/utils/connectMongo";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/user";
import { hashPass } from "@/lib/encrypt";


export const POST = async (req: NextRequest) => {
    
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const hashedPass = await hashPass(password);

    try {

        await connectMongo();

        const existing = await User.findOne({ email });

        if (existing) {
            return NextResponse.json({message: "User already exists."}, {status: 400});
        }

        const user = await User.create({
            name,
            email,
            password: hashedPass,
        })
        
        user.save();

        return NextResponse.json({message: "User created successfully."}, {status: 201});


    } catch (error:any) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}   