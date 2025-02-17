import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ref, campaign_place, panchayat, date, VILLAGE_NAME, mandal, district, state, pin, images } = body;

        const query = `
            INSERT INTO medicalcamp 
            (ref, campaign_place, panchayat, date, VILLAGE_NAME, mandal, district, state, pin, images) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [ref, campaign_place, panchayat, date, VILLAGE_NAME, mandal, district, state, pin, JSON.stringify(images)];

        const result: any = await pool.query(query, params);

        return NextResponse.json(result);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to insert record' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');  // Optional: Filter by specific ID

        let query = 'SELECT * FROM medicalcamp';
        let params: any[] = [];

        if (id) {
            query += ' WHERE id = ?';
            params = [id];
        }

        const [rows]: any = await pool.query(query, params);
        // Fetch borewell data and corresponding photos asynchronously
        const medicalcampData = await Promise.all(rows.map(async (row: any) => {
            const [records]: any = await pool.query(
                'SELECT * FROM medical_camp_records WHERE medical_camp_id = ?',
                [row.id]
            );

            return {
                ...row,
                medicalCampRecords : records
            };
        }));

        return NextResponse.json(medicalcampData);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ref, campaign_place, panchayat, date, VILLAGE_NAME, mandal, district, state, pin, images } = body;

        const query = `
            UPDATE medicalcamp 
            SET ref = ?, campaign_place = ?, panchayat = ?, date = ?, VILLAGE_NAME = ?, mandal = ?, district = ?, state = ?, pin = ?, images = ?
            WHERE id = ?
        `;
        const params = [ref, campaign_place, panchayat, date, VILLAGE_NAME, mandal, district, state, pin, JSON.stringify(images), id];

        const [result]: any = await pool.query(query, params);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'No record found to update' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Record updated successfully' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');  // Get ID from query params

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const query = 'DELETE FROM medicalcamp WHERE id = ?';
        const params = [id];

        const [result]: any = await pool.query(query, params);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'No record found to delete' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Record deleted successfully' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
    }
}
