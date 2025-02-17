import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        let query;
        let params: any = [];

        if (id) {
            query = 'SELECT * FROM village_survey WHERE id = ?';
            params = [id];
        } else {
            query = 'SELECT * FROM village_survey';
        }
        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch village survey records' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const region = formData.get('REGION') as string;
        const villageName = formData.get('VILLAGE_NAME') as string;
        const villagePopulation = formData.get('VILLAGE_POPULATION') as string;
        const gramPanchayatName = formData.get('GRAM_PANCHAYAT_NAME') as string;
        const panchayatPopulation = formData.get('PANCHAYAT_POPULATION') as string;
        const mandalName = formData.get('MANDAL_NAME') as string;
        const districtName = formData.get('DISTRICT_NAME') as string;
        const state = formData.get('STATE') as string;
        const pincode = formData.get('PINCODE') as string;
        const latitude = formData.get('LATITUDE') as string;
        const longitude = formData.get('LONGITUDE') as string;
        const numberOfTemples = formData.get('NUMBER_OF_TEMPLE') as string;
        const numberOfChurches = formData.get('NUMBER_OF_CHURCHES') as string;
        const numberOfMosques = formData.get('NUMBER_OF_MOSQUES') as string;
        const villageLeaderName = formData.get('VILLAGE_LEADER_NAME') as string;
        const requestedFor = formData.get('REQUESTED_FOR') as string;
        const detailsForPrograms = formData.get('DETAILS_FOR_PROGRAMS') as string;
        const requestedThrough = formData.get('REQUESTED_THROUGH') as string;
        const requestedByName = formData.get('REQUESTED_BY_NAME') as string;
        const requestedDetails = formData.get('REQUESTED_DETAILS') as string;
        const requestedPhoneNumber = formData.get('REQUESTED_PHONE_NUMBER') as string;
        const finalDecision = formData.get('FINAL_DECISION') as string;
        const finalDecisionReason = formData.get('FINAL_DECISION_REASON') as string;
        const status = formData.get('status') as string;

        const [result] = await pool.query(
            'INSERT INTO village_survey (region, village_name, village_population, gram_panchayat_name, panchayat_population, mandal_name, district_name, state, pincode, latitude, longitude, number_of_temple, number_of_churches, number_of_mosques, village_leader_name, requested_for, details_for_programs, requested_through, requested_by_name, requested_details, requested_phone_number, final_decision, final_decision_reason, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                region, villageName, villagePopulation, gramPanchayatName, panchayatPopulation, mandalName, districtName,
                state, pincode, latitude, longitude, numberOfTemples, numberOfChurches, numberOfMosques, villageLeaderName,
                requestedFor, detailsForPrograms, requestedThrough, requestedByName, requestedDetails, requestedPhoneNumber,
                finalDecision, finalDecisionReason, status
            ]
        );

        return NextResponse.json({ message: 'Village survey created', id: (result as any).insertId }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to create village survey' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = parseInt(formData.get('id') as string);
        const region = formData.get('REGION') as string;
        const villageName = formData.get('VILLAGE_NAME') as string;
        const villagePopulation = formData.get('VILLAGE_POPULATION') as string;
        const gramPanchayatName = formData.get('GRAM_PANCHAYAT_NAME') as string;
        const panchayatPopulation = formData.get('PANCHAYAT_POPULATION') as string;
        const mandalName = formData.get('MANDAL_NAME') as string;
        const districtName = formData.get('DISTRICT_NAME') as string;
        const state = formData.get('STATE') as string;
        const pincode = formData.get('PINCODE') as string;
        const latitude = formData.get('LATITUDE') as string;
        const longitude = formData.get('LONGITUDE') as string;
        const numberOfTemples = formData.get('NUMBER_OF_TEMPLE') as string;
        const numberOfChurches = formData.get('NUMBER_OF_CHURCHES') as string;
        const numberOfMosques = formData.get('NUMBER_OF_MOSQUES') as string;
        const villageLeaderName = formData.get('VILLAGE_LEADER_NAME') as string;
        const requestedFor = formData.get('REQUESTED_FOR') as string;
        const detailsForPrograms = formData.get('DETAILS_FOR_PROGRAMS') as string;
        const requestedThrough = formData.get('REQUESTED_THROUGH') as string;
        const requestedByName = formData.get('REQUESTED_BY_NAME') as string;
        const requestedDetails = formData.get('REQUESTED_DETAILS') as string;
        const requestedPhoneNumber = formData.get('REQUESTED_PHONE_NUMBER') as string;
        const finalDecision = formData.get('FINAL_DECISION') as string;
        const finalDecisionReason = formData.get('FINAL_DECISION_REASON') as string;
        const status = formData.get('status') as string;

        const [result] = await pool.query(
            'UPDATE village_survey SET region = ?, village_name = ?, village_population = ?, gram_panchayat_name = ?, panchayat_population = ?, mandal_name = ?, district_name = ?, state = ?, pincode = ?, latitude = ?, longitude = ?, number_of_temple = ?, number_of_churches = ?, number_of_mosques = ?, village_leader_name = ?, requested_for = ?, details_for_programs = ?, requested_through = ?, requested_by_name = ?, requested_details = ?, requested_phone_number = ?, final_decision = ?, final_decision_reason = ?, status = ? WHERE id = ?',
            [
                region, villageName, villagePopulation, gramPanchayatName, panchayatPopulation, mandalName, districtName,
                state, pincode, latitude, longitude, numberOfTemples, numberOfChurches, numberOfMosques, villageLeaderName,
                requestedFor, detailsForPrograms, requestedThrough, requestedByName, requestedDetails, requestedPhoneNumber,
                finalDecision, finalDecisionReason, status, id
            ]
        );

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'Village survey not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Village survey updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update village survey' }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const [result] = await pool.query('DELETE FROM village_survey WHERE id = ?', [id]);

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'Village survey not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Village survey deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete village survey' }, { status: 500 });
    }
}
