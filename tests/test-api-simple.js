import http from 'http';

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/characters',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', data);
    const characters = JSON.parse(data);
    console.log('\nTotal characters from API:', characters.length);
    characters.forEach(char => {
      console.log(`- ${char.name} (${char.role}, Tier: ?)`);
    });
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
