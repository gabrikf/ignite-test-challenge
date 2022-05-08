import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let userId: string;
describe("AuthenticateUserUseCase", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    const { id } = await createUserUseCase.execute({
      email: "roland@ronaldo.com",
      name: "Roland",
      password: "aiaiaiaiaiai",
    });
    userId = id || "";
  });
  it("should find an user", async () => {
    const user = await showUserProfileUseCase.execute(userId);
    expect(user).toHaveProperty("email");
  });
  it("should find an user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("wrongId");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
