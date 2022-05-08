import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let userRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
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
    const { id } = await createUserUseCase.execute({
      email: "roland@ronaldo.com",
      name: "Roland",
      password: "aiaiaiaiaiai",
    });
    user_id = id || "";
    await createStatementUseCase.execute({
      user_id,
      amount: 100,
      description: "receba",
      type: OperationType.DEPOSIT,
    });
    await createStatementUseCase.execute({
      user_id,
      amount: 10,
      description: "manda ai",
      type: OperationType.WITHDRAW,
    });
  });

  it("should return user balance", async () => {
    const balance = await getBalanceUseCase.execute({
      user_id,
    });
    expect(balance).toHaveProperty("balance");
    expect(balance).toHaveProperty("statement");
  });
  it("should return an error when user do not exist", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "wrong_user_id",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
