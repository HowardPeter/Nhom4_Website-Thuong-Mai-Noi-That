const fs = require('fs');
const path = require('path');

const files = ['frontend_licenses.json', 'backend_licenses.json'];
const outputPath = 'THIRD_PARTY_LICENSE.txt';

let allLicenses = {};

files.forEach(file => {
    const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));

    for (const [pkg, data] of Object.entries(jsonData)) {
        let licenseText = data.licenseText || '';
        if (!licenseText && data.licenseFile && fs.existsSync(data.licenseFile)) {
            try {
                licenseText = fs.readFileSync(data.licenseFile, 'utf8');
            } catch (err) {
                licenseText = '[Không đọc được nội dung giấy phép]';
            }
        }

        allLicenses[pkg] = {
            name: pkg,
            version: data.version || 'N/A',
            licenses: data.licenses || 'UNKNOWN',
            licenseText,
            publisher: data.publisher || '',
            repository: data.repository || '',
        };
    }
});

let output = `
           LICENSES FOR THIRD-PARTY COMPONENTS
            Nhom4 Website Thương Mại Nội Thất

===============================================================================
Chúng tôi xin cảm ơn cộng đồng mã nguồn mở đã phát triển các thư viện sau.
Dưới đây là thông tin bản quyền và giấy phép tương ứng.
===============================================================================

`;

for (const [_, lib] of Object.entries(allLicenses)) {
    output += `
${lib.name} (${lib.version})

License: ${lib.licenses}
Repository: ${lib.repository || 'Không có'}
Publisher: ${lib.publisher || 'Không rõ'}

${lib.licenseText.trim() || '[Không có nội dung giấy phép chi tiết]'}

-------------------------------------------------------------------------------
`;
}

fs.writeFileSync(outputPath, output, 'utf8');
console.log(`✅ Đã tạo file ${outputPath}`);
