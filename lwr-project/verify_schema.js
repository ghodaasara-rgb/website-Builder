// using native fetch

async function test() {
    const baseUrl = 'http://localhost:3001/api/schema';

    try {
        console.log('1. Creating Object "Project"...');
        const objRes = await fetch(`${baseUrl}/objects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                label: 'Project',
                plural_label: 'Projects'
            })
        });

        if (!objRes.ok) {
            const err = await objRes.text();
            throw new Error(`Create Object Failed: ${err}`);
        }

        const objData = await objRes.json();
        console.log('✓ Object Created:', objData);
        const objectId = objData.object.id;

        console.log('\n2. Creating Field "Status" (Picklist)...');
        const fieldRes = await fetch(`${baseUrl}/fields`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                object_id: objectId,
                label: 'Status',
                data_type: 'PICKLIST',
                metadata: { values: ['Planned', 'Active', 'Completed'] }
            })
        });

        if (!fieldRes.ok) {
            const err = await fieldRes.text();
            throw new Error(`Create Field Failed: ${err}`);
        }

        const fieldData = await fieldRes.json();
        console.log('✓ Field Created:', fieldData);

        console.log('\n✓ VERIFICATION SUCCESSFUL');

    } catch (error) {
        console.error('❌ Verification Failed:', error.message);
        process.exit(1);
    }
}

test();
