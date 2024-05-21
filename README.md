

### Usuario
- **id**: Identificador único do usuário.
- **nome**: Nome do usuário.
- **sobrenome**: Sobrenome do usuário.
- **endereco**: Endereço do usuário.
- **dataNascimento**: Data de nascimento do usuário.
- **email**: Endereço de e-mail do usuário.
- **telefone**: Número de telefone do usuário.
- **senha**: Senha do usuário.
- **investimentos**: Lista de investimentos associados ao usuário.
- **conta**: Conta bancária associada ao usuário.

## Conta Bancaria
accountId: Identificador único da conta bancária.
userId: Identificador do usuário proprietário da conta.
accountNumber: Número da conta bancária.
accountHolderID: Identificação do titular da conta.
balance: Saldo da conta bancária.
transactions: Lista de transações associadas à conta.
status: Status da conta bancária.
createdAt: Data de criação da conta bancária.
updatedAt: Data de atualização da conta bancária.
investimentos: Lista de investimentos associados a esta conta.

bancosExternos: Lista de informações sobre bancos externos associados a esta conta para saques.
  accountHolderName: Nome do titular da conta no banco externo.
  accountNumber: Número da conta no banco externo.
  iban: Número IBAN do banco externo.
  bic: Código BIC do banco externo.


### Transacao
- **transactionId**: Identificador único da transação.
- **accountId**: Identificador da conta associada à transação.
- **type**: Tipo de transação (depósito, saque, etc.).
- **amount**: Valor da transação.
- **timestamp**: Data e hora da transação.

### Investimento
investmentId: Identificador único do investimento.
accountId: Identificador da conta associada ao investimento.
investmentType: Tipo de investimento (ações, fundos, criptomoedas, etc.).
amount: Valor investido na transação.
quantity: Quantidade de ativos adquiridos.
purchasePricePerUnit: Preço de compra por unidade do ativo.
currentPricePerUnit: Preço atual de mercado por unidade do ativo.
timestamp: Data e hora da transação de investimento.
risk: Nível de risco associado ao investimento (baixo, médio, alto).
prazo: Prazo de duração do investimento (curto prazo, médio prazo, longo prazo).
modalidadePagamento: Modalidade de pagamento do investimento (à vista, parcelado, etc.).
progressoCaptacao: Progresso da captação de recursos para o investimento (em porcentagem).
dataLiberacao: Data em que o valor do investimento é liberado para o cliente.