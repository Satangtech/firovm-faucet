db.createUser({
  user: 'test',
  pwd: 'test',
  roles: [
    {
      role: 'readWrite',
      db: 'faucet-test',
    },
  ],
});
