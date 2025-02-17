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

// GET operation (Read)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        let query;
        let params: any = [];

        if (id) {
            query = 'SELECT * FROM otheractivities WHERE id = ?';
            params = [id];
        } else {
            query = 'SELECT * FROM otheractivities';
        }
        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }
}

// POST operation (Create)
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const date = formData.get('date') as string;
        const time = formData.get('time') as string;
        const userid = formData.get('userid') as string;
        const ref = formData.get('ref') as string;
        const name = formData.get('Name') as string;
        const A_date = formData.get('A_date') as string;
        const purpose = formData.get('purpose') as string;
        const description = formData.get('description') as string;
        const address = formData.get('address') as string;
        const latitude = formData.get('latitude') as string;
        const longitude = formData.get('longitude') as string;
        const photoFile = formData.get('photo') as File;

        if (!date || !time || !userid || !ref || !name || !A_date || !purpose || !description || !address || !latitude || !longitude || !photoFile) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const photo = await saveFile(photoFile);

        const [result] = await pool.query(
            'INSERT INTO otheractivities (date, time, userid, ref, Name, A_date, purpose, description, address, latitude, longitude, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [date, time, userid, ref, name, A_date, purpose, description, address, latitude, longitude, photo]
        );

        const newActivity = {
            id: (result as any).insertId,
            date,
            time,
            userid,
            ref,
            Name: name,
            A_date,
            purpose,
            description,
            address,
            latitude,
            longitude,
            photo
        };

        return NextResponse.json(newActivity, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
    }
}

// PUT operation (Update)
export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = parseInt(formData.get('id') as string);
        const date = formData.get('date') as string;
        const time = formData.get('time') as string;
        const userid = formData.get('userid') as string;
        const ref = formData.get('ref') as string;
        const name = formData.get('Name') as string;
        const A_date = formData.get('A_date') as string;
        const purpose = formData.get('purpose') as string;
        const description = formData.get('description') as string;
        const address = formData.get('address') as string;
        const latitude = formData.get('latitude') as string;
        const longitude = formData.get('longitude') as string;
        const photoFile = formData.get('photo') as File;

        if (!id || !date || !time || !userid || !ref || !name || !A_date || !purpose || !description || !address || !latitude || !longitude) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        let photo = null;
        if (photoFile) {
            photo = await saveFile(photoFile);
        }

        const query = `UPDATE otheractivities SET date = ?, time = ?, userid = ?, ref = ?, Name = ?, A_date = ?, purpose = ?, description = ?, address = ?, latitude = ?, longitude = ?${photo ? ', photo = ?' : ''} WHERE id = ?`;
        const dataArray: any = [date, time, userid, ref, name, A_date, purpose, description, address, latitude, longitude];
        if (photo) {
            dataArray.push(photo);
        }
        dataArray.push(id);

        const [result] = await pool.query(query, dataArray);

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }

        const updatedActivity = {
            id,
            date,
            time,
            userid,
            ref,
            Name: name,
            A_date,
            purpose,
            description,
            address,
            latitude,
            longitude,
            photo
        };

        return NextResponse.json(updatedActivity);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
    }
}

// DELETE operation (Delete)
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const [result] = await pool.query('DELETE FROM otheractivities WHERE id = ?', [id]);

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Activity deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
    }
}
