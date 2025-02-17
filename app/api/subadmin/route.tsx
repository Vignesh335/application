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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        let query;
        let params: any = [];

        if (id) {
            query = 'SELECT * FROM subadmin WHERE id = ?';
            params = [id];
        } else {
            query = 'SELECT * FROM subadmin';
        }
        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch sub admin' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const location = formData.get('location') as string;
        const photoFile = formData.get('photo') as File;
        const status = formData.get('status') as File;

        if (!username || !password || !email || !phone || !location || !photoFile) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const photo = await saveFile(photoFile);

        const [result] = await pool.query(
            'INSERT INTO subadmin (username, password, email, phone, location, photo, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, password, email, phone, location, photo, status ?? false]
        );

        const newSubAdmin = {
            id: (result as any).insertId,
            username,
            password,
            email,
            phone,
            location,
            photo,
            status
        };

        return NextResponse.json(newSubAdmin, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = parseInt(formData.get('id') as string);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const location = formData.get('location') as string;
        const photoFile = formData.get('photo') as any;
        const status = formData.get('status') as string;

        if (!id || !username || !password || !email || !phone || !location) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        let photo = null
        if (photoFile) {
            photo = await saveFile(photoFile);
        }

        const query = `UPDATE subadmin SET username = ?, password = ?, email = ?, phone = ?, location = ?, ${photo ? 'photo = ?,' : ''} status = ? WHERE id = ?`
        const dataArray: any = [username, password, email, phone, location]
        if (photo) {
            dataArray.push(photo)
        }
        dataArray.push(status)
        dataArray.push(id)

        const [result] = await pool.query(
            query,
            dataArray
        );

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'Sub Admin not found' }, { status: 404 });
        }

        const updatedSubAdmin = {
            id,
            username,
            password,
            email,
            phone,
            location,
            photo,
            status
        };

        return NextResponse.json(updatedSubAdmin);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update sub admin' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const [result] = await pool.query('DELETE FROM subadmin WHERE id = ?', [id]);

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Admin deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
    }
}