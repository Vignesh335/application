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
        const type = searchParams.get('type');

        let query;
        let params: any = [];

        if (id) {
            query = 'SELECT * FROM widow_aged WHERE id = ?';
            params = [id];
        } else if (type) {
            query = 'SELECT * FROM widow_aged WHERE app_type = ?';
            params = [type];
        } else {
            query = 'SELECT * FROM widow_aged';
        }
        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch widow_aged records' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // Extract fields
        const appType = formData.get('app_type') as string;
        const time = formData.get('time') as string;
        const date = formData.get('date') as string;
        const refer = formData.get('refer') as string;
        const subRefer = formData.get('sub_refer') as string;
        const nameOfApplicant = formData.get('NAME_OF_THE_APPLICANTE') as string;
        const dateOfBirth = formData.get('DATE_OF_BIRTH') as string;
        const aadharCardNumber = formData.get('AADHAR_CARD_NUMBER') as string;
        const husbandName = formData.get('HUSBAND_NAME') as string;
        const marriageDate = formData.get('MARRIAGE_DATE') as string;
        const numberOfChildren = formData.get('NUMBER_OF_CHILDREN') as string;
        const husbandPassedYear = formData.get('HUSBAND_PASSED_YEAR') as string;
        const causeOfDeath = formData.get('CAUSE_OF_DEATH') as string;
        const receivingPension = formData.get('RECEVING_PENSION') as string;
        const healthProblems = formData.get('HEALTH_PROBLEMS') as string;
        const presentLivingStatus = formData.get('PRESENT_LIVING_STATUS') as string;
        const doorNumber = formData.get('Door_Number') as string;
        const street = formData.get('Street') as string;
        const village = formData.get('Village') as string;
        const city = formData.get('City') as string;
        const mandalName = formData.get('MANDAL_NAME') as string;
        const districtName = formData.get('DISTRICT_NAME') as string;
        const state = formData.get('STATE') as string;
        const pincode = formData.get('PINCODE') as string;
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

        // Validate app_type to be either 0 or 1
        if (appType !== '0' && appType !== '1') {
            return NextResponse.json({ error: 'Invalid app_type. Only 0 (old_aged) or 1 (widow) are allowed.' }, { status: 400 });
        }

        // Determine the app type (old_aged or widow)
        const appTypeLabel = appType === '0' ? 'old_aged' : 'widow';

        // Validate required fields
        if (!nameOfApplicant || !dateOfBirth || !aadharCardNumber || !husbandName || !appType) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const photo = await saveFile(photoFile);
        const fullPhoto = await saveFile(fullPhotoFile);

        // Insert record into the `widow_aged` table
        const [result] = await pool.query(
            'INSERT INTO widow_aged (app_type, time, date, refer, sub_refer, NAME_OF_THE_APPLICANTE, DATE_OF_BIRTH, AADHAR_CARD_NUMBER, HUSBAND_NAME, MARRIAGE_DATE, NUMBER_OF_CHILDREN, HUSBAND_PASSED_YEAR, CAUSE_OF_DEATH, RECEVING_PENSION, HEALTH_PROBLEMS, PRESENT_LIVING_STATUS, Door_Number, Street, Village, City, MANDAL_NAME, DISTRICT_NAME, STATE, PINCODE, PHONE_NUMBER, REQUESTED_THROUGH, REQUESTED_BY_NAME, REQUESTED_PLACE, REQUESTED_PHONE_NUMBER, status, photo, Full_Photo, LATITUDE, LONGITUDE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                appType, time, date, refer, subRefer, nameOfApplicant, dateOfBirth, aadharCardNumber, husbandName, marriageDate,
                numberOfChildren, husbandPassedYear, causeOfDeath, receivingPension, healthProblems, presentLivingStatus, doorNumber,
                street, village, city, mandalName, districtName, state, pincode, phoneNumber, requestedThrough, requestedByName,
                requestedPlace, requestedPhoneNumber, status, photo, fullPhoto, latitude, longitude
            ]
        );

        const newWidowAged = {
            id: (result as any).insertId,
            appType: appTypeLabel,  // Set the app type as old_aged or widow
            time, date, refer, subRefer, nameOfApplicant, dateOfBirth, aadharCardNumber, husbandName, marriageDate,
            numberOfChildren, husbandPassedYear, causeOfDeath, receivingPension, healthProblems, presentLivingStatus, doorNumber,
            street, village, city, mandalName, districtName, state, pincode, phoneNumber, requestedThrough, requestedByName,
            requestedPlace, requestedPhoneNumber, status, photo, fullPhoto, latitude, longitude
        };

        return NextResponse.json(newWidowAged, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to create widow aged record' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = parseInt(formData.get('id') as string);
        const appType = formData.get('app_type') as string;
        const time = formData.get('time') as string;
        const date = formData.get('date') as string;
        const refer = formData.get('refer') as string;
        const subRefer = formData.get('sub_refer') as string;
        const nameOfApplicant = formData.get('NAME_OF_THE_APPLICANTE') as string;
        const dateOfBirth = formData.get('DATE_OF_BIRTH') as string;
        const aadharCardNumber = formData.get('AADHAR_CARD_NUMBER') as string;
        const husbandName = formData.get('HUSBAND_NAME') as string;
        const marriageDate = formData.get('MARRIAGE_DATE') as string;
        const numberOfChildren = formData.get('NUMBER_OF_CHILDREN') as string;
        const husbandPassedYear = formData.get('HUSBAND_PASSED_YEAR') as string;
        const causeOfDeath = formData.get('CAUSE_OF_DEATH') as string;
        const receivingPension = formData.get('RECEVING_PENSION') as string;
        const healthProblems = formData.get('HEALTH_PROBLEMS') as string;
        const presentLivingStatus = formData.get('PRESENT_LIVING_STATUS') as string;
        const doorNumber = formData.get('Door_Number') as string;
        const street = formData.get('Street') as string;
        const village = formData.get('Village') as string;
        const city = formData.get('City') as string;
        const mandalName = formData.get('MANDAL_NAME') as string;
        const districtName = formData.get('DISTRICT_NAME') as string;
        const state = formData.get('STATE') as string;
        const pincode = formData.get('PINCODE') as string;
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

        if (!id || !appType || !nameOfApplicant) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Validate app_type
        if (appType !== '0' && appType !== '1') {
            return NextResponse.json({ error: 'Invalid app_type. Only 0 (old_aged) or 1 (widow) are allowed.' }, { status: 400 });
        }

        const appTypeLabel = appType === '0' ? 'old_aged' : 'widow';

        let photo = null;
        let fullPhoto = null;

        if (photoFile) {
            photo = await saveFile(photoFile);
        }

        if (fullPhotoFile) {
            fullPhoto = await saveFile(fullPhotoFile);
        }

        const query = `UPDATE widow_aged SET app_type = ?, time = ?, date = ?, refer = ?, sub_refer = ?, NAME_OF_THE_APPLICANTE = ?, DATE_OF_BIRTH = ?, AADHAR_CARD_NUMBER = ?, HUSBAND_NAME = ?, MARRIAGE_DATE = ?, NUMBER_OF_CHILDREN = ?, HUSBAND_PASSED_YEAR = ?, CAUSE_OF_DEATH = ?, RECEVING_PENSION = ?, HEALTH_PROBLEMS = ?, PRESENT_LIVING_STATUS = ?, Door_Number = ?, Street = ?, Village = ?, City = ?, MANDAL_NAME = ?, DISTRICT_NAME = ?, STATE = ?, PINCODE = ?, PHONE_NUMBER = ?, REQUESTED_THROUGH = ?, REQUESTED_BY_NAME = ?, REQUESTED_PLACE = ?, REQUESTED_PHONE_NUMBER = ?, status = ?${photo ? ', photo = ?' : ''}${fullPhoto ? ', Full_Photo = ?' : ''}, LATITUDE = ?, LONGITUDE = ? WHERE id = ?`

        const [result] = await pool.query(
            query,
            [
                ...[appType, time, date, refer, subRefer, nameOfApplicant, dateOfBirth, aadharCardNumber, husbandName, marriageDate,
                    numberOfChildren, husbandPassedYear, causeOfDeath, receivingPension, healthProblems, presentLivingStatus, doorNumber,
                    street, village, city, mandalName, districtName, state, pincode, phoneNumber, requestedThrough, requestedByName,
                    requestedPlace, requestedPhoneNumber, status],
                ...(photo ? [photo] : []),
                ...(fullPhoto ? [fullPhoto] : []),
                ...[latitude, longitude, id]
            ]
        );

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'Widow aged record not found' }, { status: 404 });
        }

        const updatedWidowAged = {
            id,
            appType: appTypeLabel, // Updated app type
            time, date, refer, subRefer, nameOfApplicant, dateOfBirth, aadharCardNumber, husbandName, marriageDate,
            numberOfChildren, husbandPassedYear, causeOfDeath, receivingPension, healthProblems, presentLivingStatus, doorNumber,
            street, village, city, mandalName, districtName, state, pincode, phoneNumber, requestedThrough, requestedByName,
            requestedPlace, requestedPhoneNumber, status, photo, fullPhoto, latitude, longitude
        };

        return NextResponse.json(updatedWidowAged);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update widow aged record' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const [result] = await pool.query('DELETE FROM widow_aged WHERE id = ?', [id]);

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Record deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete widow aged record' }, { status: 500 });
    }
}
