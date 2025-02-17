import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';

const saveFile = async (image: any): Promise<string> => {
    try {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

        const fileName = `${Date.now()}.png`;

        const uploadPath = path.join(process.cwd(), "public", "uploads");

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        const filePath = path.join(uploadPath, fileName);
        fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

        return `/uploads/${fileName}`;
    } catch (error) {
        console.error('Error saving file:', error);
        throw new Error('Failed to save file');
    }
};

export async function GET() {
    try {
        const [rows] = await pool.query('SELECT * FROM `user`');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const date = formData.get('date') as string;
        const time = formData.get('time') as string;
        const refer = formData.get('refer') as string;
        const User_ID = formData.get('User_ID') as string;
        const Name_of_the_User = formData.get('Name_of_the_User') as string;
        const Date_of_Birth = formData.get('Date_of_Birth') as string;
        const Secular_Education = formData.get('Secular_Education') as string;
        const Theology_Studies = formData.get('Theology_Studies') as string;
        const Name_of_the_Wife_or_Husband = formData.get('Name_of_the_Wife_or_Husband') as string;
        const Number_of_Kids = formData.get('Number_of_Kids') as string;
        const Personal_Testimony = formData.get('Personal_Testimony') as string;
        const Name_of_the_Church = formData.get('Name_of_the_Church') as string;
        const Church_Need = formData.get('Church_Need') as string;
        const Evangelism_Need = formData.get('Evangelism_Need') as string;
        const Village_Need = formData.get('Village_Need') as string;
        const Phone_Number = formData.get('Phone_Number') as string;
        const Password = formData.get('Password') as string;
        const Door_Number = formData.get('Door_Number') as string;
        const Street = formData.get('Street') as string;
        const Village = formData.get('Village') as string;
        const Mandal = formData.get('Mandal') as string;
        const City = formData.get('City') as string;
        const Pincode = formData.get('Pincode') as string;
        const District = formData.get('District') as string;
        const State = formData.get('State') as string;
        const Country = formData.get('Country') as string;
        const photoFile = formData.get('photo') as File;

        if (!User_ID || !Password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        let photo;

        if (photoFile) {
            photo = await saveFile(photoFile);
        }

        const [result] = await pool.query(
            'INSERT INTO `user` (date, time, refer, User_ID, Name_of_the_User, Date_of_Birth, Secular_Education, Theology_Studies, Name_of_the_Wife_or_Husband, Number_of_Kids, Personal_Testimony, Name_of_the_Church, Church_Need, Evangelism_Need, Village_Need, Phone_Number, Password, Door_Number, Street, Village, Mandal, City, Pincode, District, State, Country, photo)',
            [date, time, refer, User_ID, Name_of_the_User, Date_of_Birth, Secular_Education, Theology_Studies, Name_of_the_Wife_or_Husband, Number_of_Kids, Personal_Testimony, Name_of_the_Church, Church_Need, Evangelism_Need, Village_Need, Phone_Number, Password, Door_Number, Street, Village, Mandal, City, Pincode, District, State, Country, photo]
        );

        const newUser = {
            id: (result as any).insertId,
            date,
            time,
            refer,
            User_ID,
            Name_of_the_User,
            Date_of_Birth,
            Secular_Education,
            Theology_Studies,
            Name_of_the_Wife_or_Husband,
            Number_of_Kids,
            Personal_Testimony,
            Name_of_the_Church,
            Church_Need,
            Evangelism_Need,
            Village_Need,
            Phone_Number,
            Password,
            Door_Number,
            Street,
            Village,
            Mandal,
            City,
            Pincode,
            District,
            State,
            Country,
            photo,
        };

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const date = formData.get('date') as string;
        const time = formData.get('time') as string;
        const refer = formData.get('refer') as string;
        const User_ID = formData.get('User_ID') as string;
        const Name_of_the_User = formData.get('Name_of_the_User') as string;
        const Date_of_Birth = formData.get('Date_of_Birth') as string;
        const Secular_Education = formData.get('Secular_Education') as string;
        const Theology_Studies = formData.get('Theology_Studies') as string;
        const Name_of_the_Wife_or_Husband = formData.get('Name_of_the_Wife_or_Husband') as string;
        const Number_of_Kids = formData.get('Number_of_Kids') as string;
        const Personal_Testimony = formData.get('Personal_Testimony') as string;
        const Name_of_the_Church = formData.get('Name_of_the_Church') as string;
        const Church_Need = formData.get('Church_Need') as string;
        const Evangelism_Need = formData.get('Evangelism_Need') as string;
        const Village_Need = formData.get('Village_Need') as string;
        const Phone_Number = formData.get('Phone_Number') as string;
        const Password = formData.get('Password') as string;
        const Door_Number = formData.get('Door_Number') as string;
        const Street = formData.get('Street') as string;
        const Village = formData.get('Village') as string;
        const Mandal = formData.get('Mandal') as string;
        const City = formData.get('City') as string;
        const Pincode = formData.get('Pincode') as string;
        const District = formData.get('District') as string;
        const State = formData.get('State') as string;
        const Country = formData.get('Country') as string;
        const photoFile = formData.get('photo') as File;

        if (!User_ID || !Password || !id) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        let photo = null;
        if (photoFile) {
            photo = await saveFile(photoFile);
        }

        const [result] = await pool.query(
            `UPDATE user SET date = ?, time = ?, refer = ?, User_ID = ?, Name_of_the_User = ?, Date_of_Birth = ?, Secular_Education = ?, Theology_Studies = ?, Name_of_the_Wife_or_Husband = ?, Number_of_Kids = ?, Personal_Testimony = ?, Name_of_the_Church = ?, Church_Need = ?, Evangelism_Need = ?, Village_Need = ?, Phone_Number = ?, Password = ?, Door_Number = ?, Street = ?, Village = ?, Mandal = ?, City = ?, Pincode = ?, District = ?, State = ?, Country = ?${photo ? ', photo = ?' : ''} WHERE id = ?`,
            [...[date, time,
                refer,
                User_ID,
                Name_of_the_User,
                Date_of_Birth,
                Secular_Education,
                Theology_Studies,
                Name_of_the_Wife_or_Husband,
                Number_of_Kids,
                Personal_Testimony,
                Name_of_the_Church,
                Church_Need,
                Evangelism_Need,
                Village_Need,
                Phone_Number,
                Password,
                Door_Number,
                Street,
                Village,
                Mandal,
                City,
                Pincode,
                District,
                State,
                Country],
            ...(photo ? [photo] : []),
            ...[id]
            ]
        );

        const updatedUser = {
            id,
            date,
            time,
            refer,
            User_ID,
            Name_of_the_User,
            Date_of_Birth,
            Secular_Education,
            Theology_Studies,
            Name_of_the_Wife_or_Husband,
            Number_of_Kids,
            Personal_Testimony,
            Name_of_the_Church,
            Church_Need,
            Evangelism_Need,
            Village_Need,
            Phone_Number,
            Password,
            Door_Number,
            Street,
            Village,
            Mandal,
            City,
            Pincode,
            District,
            State,
            Country,
            photo,
        };

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const [result] = await pool.query('DELETE FROM `user` WHERE `id` = ?', [id]);

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const photoPath = path.join(process.cwd(), 'public', 'uploads', `${id}.png`);
        if (fs.existsSync(photoPath)) {
            fs.unlinkSync(photoPath);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}