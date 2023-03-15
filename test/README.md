# Test case Faucet

## Assets

- `POST /assets` create an asset

```bash
# request
{
    name: 'Native',
    address: '',
    symbol: 'FVM',
    logo: 'https://fvm.org/logo.png',
    decimal: 1e8,
}
```

```bash
{
    name: 'Native',
    balance: 0,
    address: '',
    symbol: 'FVM',
    logo: 'https://fvm.org/logo.png',
    decimal: 100000000,
    _id: '641188c3af079534b6970ba4',
    __v: 0
}
```

- `POST /assets` create error duplicate key

```bash
# request
{
    name: 'Native',
    address: '',
    symbol: 'FVM',
    logo: 'https://fvm.org/logo.png',
    decimal: 1e8,
}
```

```bash
{
    statusCode: 400,
    message: 'Duplicate key',
    error: 'Bad Request'
}
```

- `POST /assets` create token

```bash
# request
{
    name: 'GOLD',
    address: '',
    symbol: 'GLD',
    logo: 'https://gold.org/logo.png',
    decimal: 1e18,
}
```

```bash
{
    name: 'GOLD',
    balance: 0,
    address: 'a1a2fb46de7a73b2393e8f8339c6b17f4ac35a83',
    symbol: 'GLD',
    logo: 'https://gold.org/logo.png',
    decimal: 1000000000000000000,
    _id: '641188c3af079534b6970ba8',
    __v: 0
}
```

- `GET /assets` get all assets

```bash
[
  {
    _id: '641188c3af079534b6970ba4',
    name: 'Native',
    balance: 4042000000000000,
    address: '',
    symbol: 'FVM',
    logo: 'https://fvm.org/logo.png',
    decimal: 100000000,
    __v: 0
  },
  {
    _id: '641188c3af079534b6970ba8',
    name: 'GOLD',
    balance: 10000,
    address: 'a1a2fb46de7a73b2393e8f8339c6b17f4ac35a83',
    symbol: 'GLD',
    logo: 'https://gold.org/logo.png',
    decimal: 1000000000000000000,
    __v: 0
  }
]
```

- `GET /assets/:id` get asset by id

```bash
{
  _id: '641188c3af079534b6970ba8',
  name: 'GOLD',
  balance: 10000,
  address: 'a1a2fb46de7a73b2393e8f8339c6b17f4ac35a83',
  symbol: 'GLD',
  logo: 'https://gold.org/logo.png',
  decimal: 1000000000000000000,
  __v: 0
}
```

- `GET /assets/:id` get native asset by id

```bash
{
  _id: '641188c3af079534b6970ba4',
  name: 'Native',
  balance: 4042000000000000,
  address: '',
  symbol: 'FVM',
  logo: 'https://fvm.org/logo.png',
  decimal: 100000000,
  __v: 0
}
```

- `GET /assets/123` get asset error invalid id

```bash
{
    statusCode: 400,
    message: 'Invalid ObjectId',
    error: 'Bad Request'
}
```

- `GET /assets/:id` get asset not found

```bash
{
    statusCode: 404,
    message: 'Asset not found'
}
```

- `PATCH /assets/:id` update asset

```bash
# request
{
    name: 'Gold'
}
```

```bash
{
  _id: '641188c3af079534b6970ba8',
  name: 'Gold',
  balance: 10000,
  address: 'a1a2fb46de7a73b2393e8f8339c6b17f4ac35a83',
  symbol: 'GLD',
  logo: 'https://gold.org/logo.png',
  decimal: 1000000000000000000,
  __v: 0
}
```

- `DELETE /assets/:id` delete asset

```bash
[
  {
    _id: '641188c3af079534b6970ba4',
    name: 'Native',
    balance: 4042000000000000,
    address: '',
    symbol: 'FVM',
    logo: 'https://fvm.org/logo.png',
    decimal: 100000000,
    __v: 0
  }
]
```

## Requests

- `POST /requests` send request native asset

```bash
# request
{
    address: 'TXZYxTskZGqFbeJ4m4PpRb1aRg1zEYfHz1',
    asset: 'Native'
}
```

```bash
{
  tx: '19911ffa480139e8ded145535899b63206de5b491cd17c40f6ced95bada9bab3'
}
```

- `POST /requests` send request token asset

```bash
# request
{
    address: 'TXZYxTskZGqFbeJ4m4PpRb1aRg1zEYfHz1',
    asset: 'Gold'
}
```

```bash
{
  tx: '7d68f3acc40abc003c3603a56347351667d0cfb42e95efb07cfebcb5f7a5a268'
}
```

- `POST /requests` request native fail

```bash
# request
{
    address: 'TXZYxTskZGqFbeJ4m4PpRb1aRg1zEYfHz1',
    asset: 'Native'
}
```

```bash
{
    id: 'REACH_LIMIT_ADDRESS',
    reason: 'the address reach limit'
}
```

- `POST /requests` send request token asset fail

```bash
# request
{
    address: 'TXZYxTskZGqFbeJ4m4PpRb1aRg1zEYfHz1',
    asset: 'Gold'
}
```

```bash
{
    id: 'REACH_LIMIT_ADDRESS',
    reason: 'the address reach limit'
}
```
