
export class JobService {
    #jobRepository;
    constructor({ jobRepository })  {
        this.#jobRepository = jobRepository
    }

    create()
}