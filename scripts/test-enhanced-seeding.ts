#!/usr/bin/env tsx

import { enhancedMarkdownParser } from '../lib/plate/enhanced-markdown-parser';

/**
 * Test script to verify enhanced markdown processing
 */
async function testEnhancedSeeding() {
    console.log('🧪 Testing enhanced markdown processing...');

    try {
        // Test getting all markdown files
        const allFiles = enhancedMarkdownParser.getAllMarkdownFiles();
        console.log(`📁 Found ${allFiles.length} markdown files:`);

        for (const file of allFiles) {
            console.log(`  - ${file.filePath} (folder: ${file.folderName})`);
        }

        // Test getting LMS content structure
        const structure = enhancedMarkdownParser.getLMSContentStructure();
        console.log('\n📚 LMS structure:');

        for (const [folderName, files] of Object.entries(structure)) {
            console.log(`  ${folderName}: ${files.length} files`);
            for (const file of files) {
                console.log(`    - ${file.filePath}`);
            }
        }

        // Test parsing a sample file if available
        if (allFiles.length > 0) {
            const sampleFile = allFiles[0];
            console.log(`\n🔍 Testing parsing of: ${sampleFile.filePath}`);

            try {
                const parsed = await enhancedMarkdownParser.parseMarkdownFile(sampleFile.filePath);
                console.log('✅ Parsing successful!');
                console.log(`  Title: ${parsed.metadata.title || 'No title'}`);
                console.log(`  Access: ${parsed.metadata.access || 'public'}`);
                console.log(`  Order: ${parsed.metadata.order || 0}`);
                console.log(`  Content length: ${parsed.content.length} characters`);
                console.log(`  HTML length: ${parsed.htmlContent.length} characters`);
                console.log(`  Plate nodes: ${Array.isArray(parsed.plateValue) ? parsed.plateValue.length : 'N/A'}`);
            } catch (error) {
                console.error(`❌ Failed to parse ${sampleFile.filePath}:`, error);
            }
        }

        console.log('\n🎉 Enhanced markdown processing test completed!');

    } catch (error) {
        console.error('💥 Error during test:', error);
        throw error;
    }
}

/**
 * Main execution
 */
if (require.main === module) {
    testEnhancedSeeding()
        .then(() => {
            console.log('🎯 Test script completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Test failed:', error);
            process.exit(1);
        });
}

export { testEnhancedSeeding };
