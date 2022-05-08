import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("CreateUserUseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });
  it("should create an user", async () => {
    const user = await createUserUseCase.execute({
      email: "roland@ronaldo.com",
      name: "Roland",
      password: "aiaiaiaiaiai",
    });
    expect(user).toHaveProperty("id");
  });
  it("should not create an user with an existent email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "roland@ronaldo.com",
        name: "Roland",
        password: "aiaiaiaiaiai",
      });
      await createUserUseCase.execute({
        email: "roland@ronaldo.com",
        name: "Roland",
        password: "aiaiaiaiaiai",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
