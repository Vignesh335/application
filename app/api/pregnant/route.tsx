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
            query = 'SELECT * FROM pregnant WHERE id = ?';
            params = [id];
        } else {
            query = 'SELECT * FROM pregnant';
        }
        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch pregnant records' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const time = formData.get('time') as string;
        const date = formData.get('date') as string;
        const refer = formData.get('refer') as string;
        const subRefer = formData.get('sub_refer') as string;
        const pregnantName = formData.get('PREGNANT_NAME') as string;
        const dateOfBirth = formData.get('DATE_OF_BIRTH') as string;
        const aadharCardNumber = formData.get('AADHAR_CARD_NUMBER') as string;
        const education = formData.get('EDUCATION') as string;
        const husbandName = formData.get('HUSBAND_NAME') as string;
        const deliveryDate = formData.get('DELIVERY_DATE') as string;
        const marriageDate = formData.get('MARRIAGE_DATE') as string;
        const numberOfChildren = formData.get('NUMBER_OF_CHILDREN') as string;
        const healthProblems = formData.get('HEALTH_PROBLEMS') as string;
        const presentLivingStatus = formData.get('PRESENT_LIVING_STATUS') as string;
        const doorNumber = formData.get('Door_Number') as string;
        const street = formData.get('Street') as string;
        const villageName = formData.get('VILLAGE_NAME') as string;
        const mandal = formData.get('Mandal') as string;
        const city = formData.get('City') as string;
        const pincode = formData.get('Pincode') as string;
        const district = formData.get('District') as string;
        const state = formData.get('State') as string;
        const country = formData.get('Country') as string;
        const phoneNumber = formData.get('PHONE_NUMBER') as string;
        const requestedThrough = formData.get('REQUESTED_THROUGH') as string;
        const requestedByName = formData.get('REQUESTED_BY_NAME') as string;
        const requestedPlace = formData.get('REQUESTED_PLACE') as string;
        const requestedPhoneNumber = formData.get('REQUESTED_PHONE_NUMBER') as string;
        const status = formData.get('status') as string;
        const photoFile = formData.get('photo') as File;
        const fullPhotoFile = formData.get('Full_Photo') as File;
        const latitude = formData.get('LATITUDE') as string;
        const longitude = formData.get('LONGITUDE') as string;

        if (!time || !date || !pregnantName) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const photo = await saveFile(photoFile);
        const fullPhoto = await saveFile(fullPhotoFile);

        const [result] = await pool.query(
            'INSERT INTO pregnant (time, date, refer, sub_refer, PREGNANT_NAME, DATE_OF_BIRTH, AADHAR_CARD_NUMBER, EDUCATION, HUSBAND_NAME, DELIVERY_DATE, MARRIAGE_DATE, NUMBER_OF_CHILDREN, HEALTH_PROBLEMS, PRESENT_LIVING_STATUS, Door_Number, Street, VILLAGE_NAME, Mandal, City, Pincode, District, State, Country, PHONE_NUMBER, REQUESTED_THROUGH, REQUESTED_BY_NAME, REQUESTED_PLACE, REQUESTED_PHONE_NUMBER, status, photo, Full_Photo, LATITUDE, LONGITUDE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                time, date, refer, subRefer, pregnantName, dateOfBirth, aadharCardNumber, education, husbandName, deliveryDate,
                marriageDate, numberOfChildren, healthProblems, presentLivingStatus, doorNumber, street, villageName, mandal, city,
                pincode, district, state, country, phoneNumber, requestedThrough, requestedByName, requestedPlace, requestedPhoneNumber,
                status, photo, fullPhoto, latitude, longitude
            ]
        );

        const newPregnant = {
            id: (result as any).insertId,
            time, date, refer, subRefer, pregnantName, dateOfBirth, aadharCardNumber, education, husbandName, deliveryDate,
            marriageDate, numberOfChildren, healthProblems, presentLivingStatus, doorNumber, street, villageName, mandal, city,
            pincode, district, state, country, phoneNumber, requestedThrough, requestedByName, requestedPlace, requestedPhoneNumber,
            status, photo, fullPhoto, latitude, longitude
        };

        return NextResponse.json(newPregnant, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to create pregnant record' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = parseInt(formData.get('id') as string);
        const time = formData.get('time') as string;
        const date = formData.get('date') as string;
        const refer = formData.get('refer') as string;
        const subRefer = formData.get('sub_refer') as string;
        const pregnantName = formData.get('PREGNANT_NAME') as string;
        const dateOfBirth = formData.get('DATE_OF_BIRTH') as string;
        const aadharCardNumber = formData.get('AADHAR_CARD_NUMBER') as string;
        const education = formData.get('EDUCATION') as string;
        const husbandName = formData.get('HUSBAND_NAME') as string;
        const deliveryDate = formData.get('DELIVERY_DATE') as string;
        const marriageDate = formData.get('MARRIAGE_DATE') as string;
        const numberOfChildren = formData.get('NUMBER_OF_CHILDREN') as string;
        const healthProblems = formData.get('HEALTH_PROBLEMS') as string;
        const presentLivingStatus = formData.get('PRESENT_LIVING_STATUS') as string;
        const doorNumber = formData.get('Door_Number') as string;
        const street = formData.get('Street') as string;
        const villageName = formData.get('VILLAGE_NAME') as string;
        const mandal = formData.get('Mandal') as string;
        const city = formData.get('City') as string;
        const pincode = formData.get('Pincode') as string;
        const district = formData.get('District') as string;
        const state = formData.get('State') as string;
        const country = formData.get('Country') as string;
        const phoneNumber = formData.get('PHONE_NUMBER') as string;
        const requestedThrough = formData.get('REQUESTED_THROUGH') as string;
        const requestedByName = formData.get('REQUESTED_BY_NAME') as string;
        const requestedPlace = formData.get('REQUESTED_PLACE') as string;
        const requestedPhoneNumber = formData.get('REQUESTED_PHONE_NUMBER') as string;
        const status = formData.get('status') as string;
        const photoFile = formData.get('photo') as File;
        const fullPhotoFile = formData.get('Full_Photo') as File;
        const latitude = formData.get('LATITUDE') as string;
        const longitude = formData.get('LONGITUDE') as string;

        if (!id || !pregnantName) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        let photo = null;
        let fullPhoto = null;
        if (photoFile) {
            photo = await saveFile(photoFile);
        }
        if (fullPhotoFile) {
            fullPhoto = await saveFile(fullPhotoFile);
        }

        const query = `UPDATE pregnant SET time = ?, date = ?, refer = ?, sub_refer = ?, PREGNANT_NAME = ?, DATE_OF_BIRTH = ?, AADHAR_CARD_NUMBER = ?, EDUCATION = ?, HUSBAND_NAME = ?, DELIVERY_DATE = ?, MARRIAGE_DATE = ?, NUMBER_OF_CHILDREN = ?, HEALTH_PROBLEMS = ?, PRESENT_LIVING_STATUS = ?, Door_Number = ?, Street = ?, VILLAGE_NAME = ?, Mandal = ?, City = ?, Pincode = ?, District = ?, State = ?, Country = ?, PHONE_NUMBER = ?, REQUESTED_THROUGH = ?, REQUESTED_BY_NAME = ?, REQUESTED_PLACE = ?, REQUESTED_PHONE_NUMBER = ?, status = ?${photo ? ', photo = ?' : ''}${fullPhoto ? ', Full_Photo = ?' : ''}, LATITUDE = ?, LONGITUDE = ? WHERE id = ?`

        const [result] = await pool.query(
            query,
            [
                ...[
                    time, date, refer, subRefer, pregnantName, dateOfBirth, aadharCardNumber, education, husbandName, deliveryDate,
                    marriageDate, numberOfChildren, healthProblems, presentLivingStatus, doorNumber, street, villageName, mandal, city,
                    pincode, district, state, country, phoneNumber, requestedThrough, requestedByName, requestedPlace, requestedPhoneNumber,
                    status
                ],
                ...(photo ? [photo] : []),
                ...(fullPhoto ? [fullPhoto] : []),
                ...[latitude, longitude, id]
            ]
        );

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'Pregnant record not found' }, { status: 404 });
        }

        const updatedPregnant = {
            id,
            time, date, refer, subRefer, pregnantName, dateOfBirth, aadharCardNumber, education, husbandName, deliveryDate,
            marriageDate, numberOfChildren, healthProblems, presentLivingStatus, doorNumber, street, villageName, mandal, city,
            pincode, district, state, country, phoneNumber, requestedThrough, requestedByName, requestedPlace, requestedPhoneNumber,
            status, photo, fullPhoto, latitude, longitude
        };

        return NextResponse.json(updatedPregnant);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to update pregnant record' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const [result] = await pool.query('DELETE FROM pregnant WHERE id = ?', [id]);

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'Pregnant record not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Pregnant record deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete pregnant record' }, { status: 500 });
    }
}
