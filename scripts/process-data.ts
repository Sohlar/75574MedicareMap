import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import zipcodes from 'zipcodes';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ProviderData {
  Rndrng_Prvdr_Zip5: string;
  Rndrng_Prvdr_State_FIPS: string;
  Rndrng_Prvdr_Type: string;
  HCPCS_Desc: string;
  Avg_Mdcr_Alowd_Amt: string;
  Tot_Benes: string;
}

interface ProcessedData extends ProviderData {
  coordinates: [number, number];
}

async function processData() {
  try {
    // Read the original data
    const dataPath = path.join(__dirname, '../public/data.json');
    const dataContent = await readFile(dataPath, 'utf-8');
    const data: ProviderData[] = JSON.parse(dataContent);

    console.log(`Processing ${data.length} records...`);

    const processedData: ProcessedData[] = [];

    // Process each provider
    for (const provider of data) {
      const zipData = zipcodes.lookup(provider.Rndrng_Prvdr_Zip5);
      if (zipData && zipData.latitude && zipData.longitude) {
        processedData.push({
          ...provider,
          coordinates: [zipData.latitude, zipData.longitude]
        });
      }
    }

    // Write the processed data
    const outputPath = path.join(__dirname, '../public/processed-data.json');
    await writeFile(outputPath, JSON.stringify(processedData, null, 2));
    
    console.log(`Processed ${processedData.length} records with coordinates`);
    console.log(`Data written to ${outputPath}`);
  } catch (error) {
    console.error('Error processing data:', error);
  }
}

processData(); 