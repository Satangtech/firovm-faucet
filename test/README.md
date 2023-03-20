# Test case Faucet

## Assets

- `POST /assets` create an asset

  - `address` is empty for native asset

  - `decimal` is decimal of asset

```bash
# Example Request
{
    name: 'Native',
    address: '',
    symbol: 'FVM',
    logo: 'https://fvm.org/logo.png',
    decimal: 8
}
```

```bash
# Example Response
{
    name: 'Native',
    balance: 0,
    address: '',
    symbol: 'FVM',
    logo: 'https://fvm.org/logo.png',
    decimal: 8,
    _id: '641188c3af079534b6970ba4',
    __v: 0
}
```

- `POST /assets` create error duplicate key

```bash
# Example Request
{
    name: 'Native',
    address: '',
    symbol: 'FVM',
    logo: 'https://fvm.org/logo.png',
    decimal: 8
}
```

```bash
# Example Response
{
    statusCode: 400,
    message: 'Duplicate key',
    error: 'Bad Request'
}
```

- `POST /assets` create token

  - `address` is address of token (The address should be on the blockchain)

```bash
# Example Request
{
    name: 'GOLD',
    address: 'a1a2fb46de7a73b2393e8f8339c6b17f4ac35a83',
    symbol: 'GLD',
    logo: 'https://gold.org/logo.png',
    decimal: 18,
}
```

```bash
# Example Response
{
    name: 'GOLD',
    balance: 0,
    address: 'a1a2fb46de7a73b2393e8f8339c6b17f4ac35a83',
    symbol: 'GLD',
    logo: 'https://gold.org/logo.png',
    decimal: 18,
    _id: '641188c3af079534b6970ba8',
    __v: 0
}
```

- `GET /assets` get all assets

```bash
# Example Response
[
  {
    _id: '641188c3af079534b6970ba4',
    name: 'Native',
    balance: 4042000000000000,
    address: '',
    symbol: 'FVM',
    logo: 'https://fvm.org/logo.png',
    decimal: 8,
    __v: 0
  },
  {
    _id: '641188c3af079534b6970ba8',
    name: 'GOLD',
    balance: 10000,
    address: 'a1a2fb46de7a73b2393e8f8339c6b17f4ac35a83',
    symbol: 'GLD',
    logo: 'https://gold.org/logo.png',
    decimal: 18,
    __v: 0
  }
]
```

- `GET /assets/all` get all assets without update balance from blockchain

```bash
# Example Response
[
  {
    _id: '641188c3af079534b6970ba4',
    name: 'Native',
    balance: 4042000000000000,
    address: '',
    symbol: 'FVM',
    logo: 'https://fvm.org/logo.png',
    decimal: 8,
    __v: 0
  },
  {
    _id: '641188c3af079534b6970ba8',
    name: 'GOLD',
    balance: 10000,
    address: 'a1a2fb46de7a73b2393e8f8339c6b17f4ac35a83',
    symbol: 'GLD',
    logo: 'https://gold.org/logo.png',
    decimal: 18,
    __v: 0
  }
]
```

- `GET /assets/:id` get asset by id

  - `:id` is field `_id` of asset

```bash
# Example Response
{
  _id: '641188c3af079534b6970ba8',
  name: 'GOLD',
  balance: 10000,
  address: 'a1a2fb46de7a73b2393e8f8339c6b17f4ac35a83',
  symbol: 'GLD',
  logo: 'https://gold.org/logo.png',
  decimal: 18,
  __v: 0
}
```

- `GET /assets/:id` get native asset by id

```bash
# Example Response
{
  _id: '641188c3af079534b6970ba4',
  name: 'Native',
  balance: 4042000000000000,
  address: '',
  symbol: 'FVM',
  logo: 'https://fvm.org/logo.png',
  decimal: 8,
  __v: 0
}
```

- `GET /assets/123` get asset error invalid id

```bash
# Example Response
{
    statusCode: 400,
    message: 'Invalid ObjectId',
    error: 'Bad Request'
}
```

- `GET /assets/:id` get asset not found

```bash
# Example Response
{
    statusCode: 404,
    message: 'Asset not found'
}
```

- `PATCH /assets/:id` update asset

```bash
# Example Request
{
    name: 'Gold'
}
```

```bash
# Example Response
{
  _id: '641188c3af079534b6970ba8',
  name: 'Gold',
  balance: 10000,
  address: 'a1a2fb46de7a73b2393e8f8339c6b17f4ac35a83',
  symbol: 'GLD',
  logo: 'https://gold.org/logo.png',
  decimal: 18,
  __v: 0
}
```

- `DELETE /assets/:id` delete asset

```bash
# Example Response
[
  {
    _id: '641188c3af079534b6970ba4',
    name: 'Native',
    balance: 4042000000000000,
    address: '',
    symbol: 'FVM',
    logo: 'https://fvm.org/logo.png',
    decimal: 8,
    __v: 0
  }
]
```

## Requests

- `POST /requests` send request native asset

  - `address` is the address the user wants to receive tokens

  - `asset` is the name of the asset

```bash
# Example Request
{
    address: 'TXZYxTskZGqFbeJ4m4PpRb1aRg1zEYfHz1',
    asset: 'Native'
}
```

```bash
# Example Response
{
  tx: '19911ffa480139e8ded145535899b63206de5b491cd17c40f6ced95bada9bab3'
}
```

- `POST /requests` send request token asset

```bash
# Example Request
{
    address: 'TXZYxTskZGqFbeJ4m4PpRb1aRg1zEYfHz1',
    asset: 'Gold'
}
```

```bash
# Example Response
{
  tx: '7d68f3acc40abc003c3603a56347351667d0cfb42e95efb07cfebcb5f7a5a268'
}
```

- `POST /requests` request native fail

```bash
# Example Request
{
    address: 'TXZYxTskZGqFbeJ4m4PpRb1aRg1zEYfHz1',
    asset: 'Native'
}
```

```bash
# Example Response
{
    id: 'REACH_LIMIT_ADDRESS',
    reason: 'the address reach limit'
}
```

- `POST /requests` send request token asset fail

```bash
# Example Request
{
    address: 'TXZYxTskZGqFbeJ4m4PpRb1aRg1zEYfHz1',
    asset: 'Gold'
}
```

```bash
# Example Response
{
    id: 'REACH_LIMIT_ADDRESS',
    reason: 'the address reach limit'
}
```
