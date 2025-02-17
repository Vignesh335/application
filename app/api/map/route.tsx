import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Query for each table separately
        const [students]: any = await pool.query('SELECT * FROM student');
        const [pregnantLadies]: any = await pool.query('SELECT * FROM pregnant');
        const [oldAgeWomen]: any = await pool.query('SELECT * FROM widow_aged where app_type=1');
        const [widows]: any = await pool.query('SELECT * FROM widow_aged where app_type = 0');

        const mapData = [
            ...students.map((row: any) => ({
                type: 'Student',
                lat: row.LATITUDE,
                lon: row.LONGITUDE,
                text: 'Student',
                icon: '/pointers/studentpointer.png'
            })),
            ...pregnantLadies.map((row: any) => ({
                type: 'Pregnant Lady',
                lat: row.LATITUDE,
                lon: row.LONGITUDE,
                text: 'Pregnant Lady',
                icon: '/pointers/pregnantpointer.png'
            })),
            ...oldAgeWomen.map((row: any) => ({
                type: 'Old Age Woman',
                lat: row.LATITUDE,
                lon: row.LONGITUDE,
                text: 'Old Age Woman',
                icon: '/pointers/oldwomen.png'
            })),
            ...widows.map((row: any) => ({
                type: 'Widow',
                lat: row.LATITUDE,
                lon: row.LONGITUDE,
                text: 'Widow',
                icon: '/pointers/widow.png'
            })),
        ];

        // Return the data as a JSON response
        return NextResponse.json(mapData, { status: 200 });
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error fetching data:", error);

        // Send a 500 error response in case of failure
        return NextResponse.json({ error: 'Error fetching map data' }, { status: 500 });
    }
}
