describe('Requests', () => {
  // const getNewAddress = async (): Promise<string> => {
  //   const res = await rpcClient.rpc('getnewaddress');
  //   const address = res.result;
  //   expect(typeof address).toBe('string');
  //   return address;
  // };
  // beforeAll(async () => {});

  it(`/POST requestAsset Native`, async () => {
    // jest.spyOn(model, 'findOne').mockReturnValue({
    //   exec: jest.fn().mockResolvedValueOnce(mockAsset.native),
    // } as any);
    // return request(app.getHttpServer())
    //   .post('/requests')
    //   .send(dataNative)
    //   .then((res) => {
    //     expect(res.status).toEqual(HttpStatus.OK);
    //     expect(res.body.tx).toEqual(txNative);
    //   });
  });

  it(`/POST requestAsset Token`, async () => {
    // jest.spyOn(model, 'findOne').mockReturnValue({
    //   exec: jest.fn().mockResolvedValueOnce(mockAsset.token),
    // } as any);
    // return request(app.getHttpServer())
    //   .post('/requests')
    //   .send(dataToken)
    //   .then((res) => {
    //     expect(res.status).toEqual(HttpStatus.OK);
    //     expect(res.body.tx).toEqual(txToken);
    //   });
  });

  // afterAll(async () => {});
});
