import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let userRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
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
    const { id } = await createUserUseCase.execute({
      email: "roland@ronaldo.com",
      name: "Roland",
      password: "aiaiaiaiaiai",
    });
    user_id = id || "";
  });

  it("should create a new deposit statement", async () => {
    const statement = await createStatementUseCase.execute({
      user_id,
      amount: 100,
      description: "receba",
      type: OperationType.DEPOSIT,
    });
    expect(statement).toHaveProperty("id");
    expect(statement.type).toBe("deposit");
  });
  it("should create a new withdraw statement", async () => {
    await createStatementUseCase.execute({
      user_id,
      amount: 100,
      description: "receba",
      type: OperationType.DEPOSIT,
    });
    const statement = await createStatementUseCase.execute({
      user_id,
      amount: 90,
      description: "manda pra ca",
      type: OperationType.WITHDRAW,
    });
    expect(statement).toHaveProperty("id");
    expect(statement.type).toBe("withdraw");
  });
  it("should not create a new withdraw statement when amount is more than user have in acc", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id,
        amount: 10,
        description: "manda pra ca",
        type: OperationType.WITHDRAW,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
  it("should not create a new statement when user do not exist", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "wrong_user_id",
        amount: 10,
        description: "manda pra ca",
        type: OperationType.DEPOSIT,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
