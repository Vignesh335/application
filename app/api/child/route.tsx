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
            query = 'SELECT * FROM student WHERE id = ?';
            params = [id];
        } else {
            query = 'SELECT * FROM student';
        }
        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const time = formData.get('time') as string;
        const date = formData.get('date') as string;
        const refer = formData.get('refer') as string;
        const subRefer = formData.get('sub_refer') as string;
        const studentFullName = formData.get('Student_Full_Name') as string;
        const dateOfBirth = formData.get('Date_of_Birth') as string;
        const className = formData.get('Class') as string;
        const schoolOrCollegeName = formData.get('School_or_College_Name') as string;
        const gender = formData.get('Gender') as string;
        const childAadharNo = formData.get('Child_Aadhar_No') as string;
        const fatherName = formData.get('Father_Name') as string;
        const motherName = formData.get('Mother_Name') as string;
        const religious = formData.get('Religious') as string;
        const casteAndSubCaste = formData.get('Caste_And_Sub_Caste') as string;
        const favoriteSubject = formData.get('Favorite_Subject') as string;
        const favoriteColour = formData.get('Favorite_Colour') as string;
        const favoriteGame = formData.get('Favorite_Game') as string;
        const bestFriend = formData.get('Best_Friend') as string;
        const hobbies = formData.get('Hobbies') as string;
        const goal = formData.get('Goal') as string;
        const doorNumber = formData.get('Door_Number') as string;
        const street = formData.get('Street') as string;
        const village = formData.get('Village') as string;
        const mandal = formData.get('Mandal') as string;
        const city = formData.get('City') as string;
        const pincode = formData.get('Pincode') as string;
        const district = formData.get('District') as string;
        const state = formData.get('State') as string;
        const country = formData.get('Country') as string;
        const parentContact = formData.get('Parent_Contact') as string;
        const status = formData.get('status') as string;
        const photoFile = formData.get('photo') as File;
        const fullPhotoFile = formData.get('Full_Photo') as File;
        const latitude = formData.get('LATITUDE') as string;
        const longitude = formData.get('LONGITUDE') as string;

        if (!time || !date || !studentFullName || !dateOfBirth || !className || !schoolOrCollegeName || !gender || !photoFile) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const photo = await saveFile(photoFile);
        const fullPhoto = await saveFile(fullPhotoFile);

        const [result] = await pool.query(
            'INSERT INTO student (time, date, refer, sub_refer, Student_Full_Name, Date_of_Birth, Class, School_or_College_Name, Gender, Child_Aadhar_No, Father_Name, Mother_Name, Religious, Caste_And_Sub_Caste, Favorite_Subject, Favorite_Colour, Favorite_Game, Best_Friend, Hobbies, Goal, Door_Number, Street, Village, Mandal, City, Pincode, District, State, Country, Parent_Contact, status, photo, Full_Photo, LATITUDE, LONGITUDE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                time, date, refer, subRefer, studentFullName, dateOfBirth, className, schoolOrCollegeName, gender, childAadharNo,
                fatherName, motherName, religious, casteAndSubCaste, favoriteSubject, favoriteColour, favoriteGame, bestFriend, hobbies, goal,
                doorNumber, street, village, mandal, city, pincode, district, state, country, parentContact, status, photo, fullPhoto, latitude, longitude
            ]
        );

        const newStudent = {
            id: (result as any).insertId,
            time, date, refer, subRefer, studentFullName, dateOfBirth, className, schoolOrCollegeName, gender, childAadharNo,
            fatherName, motherName, religious, casteAndSubCaste, favoriteSubject, favoriteColour, favoriteGame, bestFriend, hobbies, goal,
            doorNumber, street, village, mandal, city, pincode, district, state, country, parentContact, status, photo, fullPhoto, latitude, longitude
        };

        return NextResponse.json(newStudent, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
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
        const studentFullName = formData.get('Student_Full_Name') as string;
        const dateOfBirth = formData.get('Date_of_Birth') as string;
        const className = formData.get('Class') as string;
        const schoolOrCollegeName = formData.get('School_or_College_Name') as string;
        const gender = formData.get('Gender') as string;
        const childAadharNo = formData.get('Child_Aadhar_No') as string;
        const fatherName = formData.get('Father_Name') as string;
        const motherName = formData.get('Mother_Name') as string;
        const religious = formData.get('Religious') as string;
        const casteAndSubCaste = formData.get('Caste_And_Sub_Caste') as string;
        const favoriteSubject = formData.get('Favorite_Subject') as string;
        const favoriteColour = formData.get('Favorite_Colour') as string;
        const favoriteGame = formData.get('Favorite_Game') as string;
        const bestFriend = formData.get('Best_Friend') as string;
        const hobbies = formData.get('Hobbies') as string;
        const goal = formData.get('Goal') as string;
        const doorNumber = formData.get('Door_Number') as string;
        const street = formData.get('Street') as string;
        const village = formData.get('Village') as string;
        const mandal = formData.get('Mandal') as string;
        const city = formData.get('City') as string;
        const pincode = formData.get('Pincode') as string;
        const district = formData.get('District') as string;
        const state = formData.get('State') as string;
        const country = formData.get('Country') as string;
        const parentContact = formData.get('Parent_Contact') as string;
        const status = formData.get('status') as string;
        const photoFile = formData.get('photo') as File;
        const fullPhotoFile = formData.get('Full_Photo') as File;
        const latitude = formData.get('LATITUDE') as string;
        const longitude = formData.get('LONGITUDE') as string;

        if (!id || !studentFullName || !dateOfBirth || !className || !schoolOrCollegeName || !gender) {
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

        const query = `UPDATE student SET time = ?, date = ?, refer = ?, sub_refer = ?, Student_Full_Name = ?, Date_of_Birth = ?, Class = ?, School_or_College_Name = ?, Gender = ?, Child_Aadhar_No = ?, Father_Name = ?, Mother_Name = ?, Religious = ?, Caste_And_Sub_Caste = ?, Favorite_Subject = ?, Favorite_Colour = ?, Favorite_Game = ?, Best_Friend = ?, Hobbies = ?, Goal = ?, Door_Number = ?, Street = ?, Village = ?, Mandal = ?, City = ?, Pincode = ?, District = ?, State = ?, Country = ?, Parent_Contact = ?, status = ?${photo ? ', photo = ?' : ''}${fullPhoto ? ', Full_Photo = ?' : ''}, LATITUDE = ?, LONGITUDE = ? WHERE id = ?`

        const [result] = await pool.query(
            query,
            [
                ...[
                    time, date, refer, subRefer, studentFullName, dateOfBirth, className, schoolOrCollegeName, gender, childAadharNo,
                    fatherName, motherName, religious, casteAndSubCaste, favoriteSubject, favoriteColour, favoriteGame, bestFriend, hobbies, goal,
                    doorNumber, street, village, mandal, city, pincode, district, state, country, parentContact, status
                ],
                ...(photo ? [photo] : []),
                (fullPhoto ? [fullPhoto] : []),
                ...[latitude, longitude, id]
            ]
        );

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        const updatedStudent = {
            id,
            time, date, refer, subRefer, studentFullName, dateOfBirth, className, schoolOrCollegeName, gender, childAadharNo,
            fatherName, motherName, religious, casteAndSubCaste, favoriteSubject, favoriteColour, favoriteGame, bestFriend, hobbies, goal,
            doorNumber, street, village, mandal, city, pincode, district, state, country, parentContact, status, photo, fullPhoto, latitude, longitude
        };

        return NextResponse.json(updatedStudent);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const [result] = await pool.query('DELETE FROM student WHERE id = ?', [id]);

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Student deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
    }
}
