const net = require('net');

const checkPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
        resolve(false);
      } else {
        reject(err);
      }
    });
    
    server.once('listening', () => {
      server.close();
      console.log(`Port ${port} is available`);
      resolve(true);
    });
    
    server.listen(port);
  });
};

// Check port 5002
checkPort(5002)
  .then(isAvailable => {
    if (!isAvailable) {
      console.error('Please choose a different port or stop the process using port 5002');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Error checking port:', err);
    process.exit(1);
  }); 