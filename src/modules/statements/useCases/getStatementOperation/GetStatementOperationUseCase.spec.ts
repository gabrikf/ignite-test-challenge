import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let userRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let user_id: string;
describe("CreateStatementUseCase", () => {
  beforeEach(async () => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(
      userRepositoryInMemory,
      statementRepositoryInMemory
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementRepositoryInMemory,
      userRepositoryInMemory
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      userRepositoryInMemory,
      statementRepositoryInMemory
    );
    const { id } = await createUserUseCase.execute({
      email: "roland@ronaldo.com",
      name: "Roland",
      password: "aiaiaiaiaiai",
    });
    user_id = id || "";
  });

  it("should return a statement operation", async () => {
    const { id } = await createStatementUseCase.execute({
      user_id,
      amount: 100,
      description: "receba",
      type: OperationType.DEPOSIT,
    });
    const statement_id = id as string;
    const statementOp = await getStatementOperationUseCase.execute({
      user_id,
      statement_id,
    });
    expect(statementOp).toHaveProperty("id");
  });
  it("should return error when user do not exist", async () => {
    const { id } = await createStatementUseCase.execute({
      user_id,
      amount: 100,
      description: "receba",
      type: OperationType.DEPOSIT,
    });
    const statement_id = id as string;
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "wrong_user_id",
        statement_id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
  it("should return error when user statement was not found", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user_id,
        statement_id: "wrong_statement_id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
