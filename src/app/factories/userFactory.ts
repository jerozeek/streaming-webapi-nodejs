import {UserRepository} from "../repositories/userRepository";
import {UserServices} from "../services/userService";
import {serviceInterface} from "../services/interfaces";
import {userRepositoryInterface} from "../repositories/interfaces";

export const userFactory = (): serviceInterface => {
    const userRepository: userRepositoryInterface = new UserRepository();
    return new UserServices(userRepository);
}