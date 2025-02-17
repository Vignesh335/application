import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        let query = `SELECT borewell.* FROM borewell`;
        let params: any[] = [];

        if (id) {
            query += ' AND borewell.id = ?';
            params = [id];
        }

        const [rows]: any = await pool.query(query, params);

        // Fetch borewell data and corresponding photos asynchronously
        const borewellData = await Promise.all(rows.map(async (row: any) => {
            // Fetch photos for each borewell (camp_id)
            const [photoRecords]: any = await pool.query(
                'SELECT * FROM medicalphotos WHERE camp_id = ? AND type = "borewell"',
                [row.id]
            );

            // Parse photos from the 'photos' field in each record (assuming it's a JSON string)
            const photos: string[] = photoRecords.map((record: any) => {
                const filenames = JSON.parse(record.photos);  // Assuming 'photos' is a JSON string with filenames
                return filenames;
            }).flat();  // Flatten in case each record contains multiple photos

            // Return the borewell with its associated photos
            return {
                ...row,
                photos: row.photo_url ? [row.photo_url, ...photos] : photos
            };
        }));

        return NextResponse.json(borewellData);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch borewell data and photos' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // Extract form data
        const id = formData.get('id') as string;
        const date = formData.get('date') as string;
        const time = formData.get('time') as string;
        const ref = formData.get('ref') as string;
        const villageName = formData.get('Village_Name') as string;
        const mandalName = formData.get('Mandal_Name') as string;
        const districtName = formData.get('District_Name') as string;
        const stateName = formData.get('State_Name') as string;
        const typeOfDrilling = formData.get('Type_of_drilling') as string;
        const ifDrillingWithRigTypeOfRig = formData.get('If_drilling_with_rig_type_of_rig') as string;
        const drillingDepthInFeet = formData.get('Drilling_depth_in_feet') as string;
        const dimensionsOfCasing = formData.get('Dimensions_of_casing') as string;
        const casingThicknessInMM = formData.get('Casing_thickness_in_MM') as string;
        const casingDiameterInInches = formData.get('Casing_diameter_in_Inches') as string;
        const depthOfCasingInFeet = formData.get('Depth_of_casing_in_feet') as string;
        const groundWaterLevelInFeet = formData.get('Ground_water_level_in_feet') as string;
        const typeOfHandPump = formData.get('Type_of_hand_pump') as string;
        const waterPipeLength = formData.get('Water_pipe_length') as string;
        const numberOfPipesUsed = formData.get('Number_of_Pipes_used') as string;
        const numberOfRodsUsed = formData.get('Number_of_Rods_used') as string;
        const numberOfCouplingsFitted = formData.get('Number_of_Couplings_fitted') as string;
        const depthOfCylinder = formData.get('Depth_of_Cylinder') as string;
        const handSetPaint = formData.get('Hand_set_paint') as string;
        const typeOfPlatform = formData.get('Type_of_Platfor') as string;
        const plaqueType = formData.get('Plaque_type') as string;
        const ifSpecialMentionName = formData.get('If_special_mention_the_name') as string;
        const latitude = formData.get('Latitude') as string;
        const longitude = formData.get('Longitude') as string;
        const typeOfSoil = formData.get('Type_of_Soil') as string;
        const staticWaterLevel = formData.get('Static_water_level') as string;
        const totalDepthOfDrilling = formData.get('Total_depth_of_drilling') as string;
        const operatorNameAndContactNo = formData.get('Operator_Name_And_Contact_No') as string;
        const ownerNameAndContactNo = formData.get('Owner_Name_And_Contact_No') as string;
        const vehicleRCNo = formData.get('Vehicle_RC_No') as string;
        const houseOwnerFullName1 = formData.get('House_owner_Full_Name_1') as string;
        const contactNo1 = formData.get('Contact_no_1') as string;
        const signature1 = formData.get('Signature_1') as string;
        const houseOwnerFullName2 = formData.get('House_owner_Full_Name_2') as string;
        const contactNo2 = formData.get('Contact_no_2') as string;
        const signature2 = formData.get('Signature_2') as string;
        const finalStatus = formData.get('Final_Status') as string;
        const numberOfPanchayatTanksAvailable = formData.get('NUMBER_Of_PANCHAYAT_TANKS_AVAILABLE') as string;
        const numberOfPanchayatTaps = formData.get('NUMBER_OF_PANCHAYAT_TAPS') as string;
        const numberOfOpenGroundWells = formData.get('NUMBER_OF_OPEN_GROUND_WELLS') as string;
        const numberOfPanchayatBoreWells = formData.get('NUMBER_OF_PANCHAYAT_BORE_WELLS') as string;
        const numberOfNgoWells = formData.get('NUMBER_OF_NGO_WELLS') as string;
        const mentionDetails = formData.get('MENTION_DETAILS') as string;
        const dateOfDrilling = formData.get('DATE_OF_DRILLING') as string;
        const presentWellCondition = formData.get('PRESENT_WELL_CONDITION') as string;
        const nameOfNgo = formData.get('NAME_OF_NGO') as string;
        const numberOfHouseHoldsIntendedToBeServed = formData.get('NUMBER_OF_HOUSE_HOLDS_INTENDED_TO_BE_SERVED') as string;
        const selfMadeBoreWellsDetails = formData.get('SELF_MADE_BORE_WELLS_DETAILS') as string;
        const verifiedBy = formData.get('Verified_By') as string;
        const place = formData.get('Place') as string;
        const phoneNumber = formData.get('Phone_Number') as string;
        const signature = formData.get('Signature') as string;
        const status = formData.get('status') as string;

        if (!id || !date || !time || !ref || !villageName || !mandalName || !districtName || !stateName) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Insert data into the borewell table
        const [result]: any = await pool.query(
            `INSERT INTO borewell (
                id, date, time, ref, Village_Name, Mandal_Name, District_Name, State_Name,
                Type_of_drilling, If_drilling_with_rig_type_of_rig, Drilling_depth_in_feet,
                Dimensions_of_casing, Casing_thickness_in_MM, Casing_diameter_in_Inches,
                Depth_of_casing_in_feet, Ground_water_level_in_feet, Type_of_hand_pump, Water_pipe_length,
                Number_of_Pipes_used, Number_of_Rods_used, Number_of_Couplings_fitted, Depth_of_Cylinder,
                Hand_set_paint, Type_of_Platfor, Plaque_type, If_special_mention_the_name,
                Latitude, Longitude, Type_of_Soil, Static_water_level, Total_depth_of_drilling,
                Operator_Name_And_Contact_No, Owner_Name_And_Contact_No, Vehicle_RC_No,
                House_owner_Full_Name_1, Contact_no_1, Signature_1, House_owner_Full_Name_2, Contact_no_2,
                Signature_2, Final_Status, NUMBER_Of_PANCHAYAT_TANKS_AVAILABLE, NUMBER_OF_PANCHAYAT_TAPS,
                NUMBER_OF_OPEN_GROUND_WELLS, NUMBER_OF_PANCHAYAT_BORE_WELLS, NUMBER_OF_NGO_WELLS,
                MENTION_DETAILS, DATE_OF_DRILLING, PRESENT_WELL_CONDITION, NAME_OF_NGO,
                NUMBER_OF_HOUSE_HOLDS_INTENDED_TO_BE_SERVED, SELF_MADE_BORE_WELLS_DETAILS, Verified_By,
                Place, Phone_Number, Signature, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id, date, time, ref, villageName, mandalName, districtName, stateName, typeOfDrilling, ifDrillingWithRigTypeOfRig,
                drillingDepthInFeet, dimensionsOfCasing, casingThicknessInMM, casingDiameterInInches, depthOfCasingInFeet,
                groundWaterLevelInFeet, typeOfHandPump, waterPipeLength, numberOfPipesUsed, numberOfRodsUsed, numberOfCouplingsFitted,
                depthOfCylinder, handSetPaint, typeOfPlatform, plaqueType, ifSpecialMentionName, latitude, longitude,
                typeOfSoil, staticWaterLevel, totalDepthOfDrilling, operatorNameAndContactNo, ownerNameAndContactNo, vehicleRCNo,
                houseOwnerFullName1, contactNo1, signature1, houseOwnerFullName2, contactNo2, signature2, finalStatus,
                numberOfPanchayatTanksAvailable, numberOfPanchayatTaps, numberOfOpenGroundWells, numberOfPanchayatBoreWells,
                numberOfNgoWells, mentionDetails, dateOfDrilling, presentWellCondition, nameOfNgo,
                numberOfHouseHoldsIntendedToBeServed, selfMadeBoreWellsDetails, verifiedBy, place, phoneNumber, signature, status
            ]
        );

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to create borewell' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const fieldsToUpdate: any = {};
        formData.forEach((value, key) => {
            if (value) fieldsToUpdate[key] = value;
        });

        let setClause = '';
        const values = [];
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            setClause += `${key} = ?, `;
            values.push(value);
        }

        setClause = setClause.slice(0, -2); // Remove the trailing comma
        values.push(id);

        const [result] = await pool.query(
            `UPDATE borewell SET ${setClause} WHERE id = ?`, values
        );

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'Borewell not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Borewell updated successfully' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to update borewell' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const [result] = await pool.query('DELETE FROM borewell WHERE id = ?', [id]);

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: 'Borewell not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Borewell deleted successfully' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to delete borewell' }, { status: 500 });
    }
}
