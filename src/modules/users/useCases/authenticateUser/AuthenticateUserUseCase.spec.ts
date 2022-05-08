import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("AuthenticateUserUseCase", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    await createUserUseCase.execute({
      email: "roland@ronaldo.com",
      name: "Roland",
      password: "aiaiaiaiaiai",
    });
  });
  it("should authenticate user", async () => {
    const user = await authenticateUserUseCase.execute({
      email: "roland@ronaldo.com",
      password: "aiaiaiaiaiai",
    });
    expect.assertions(2);
    expect(user).toHaveProperty("user");
    expect(user).toHaveProperty("token");
  });
  it("should authenticate user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "rolan@ronaldo.com",
        password: "aiaiaiaiaiai",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
  it("should authenticate user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "roland@ronaldo.com",
        password: "incorrectPassword",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
