import { appError } from '../utils/error.js';

export function validateBody(dto, body) {
    const result = dto.safeParse(body);
    
    if (result.success === false) {
        const errMessages = result.error.issues.map(issue => 
            `${issue.path[0]}: ${issue.message}`
        );
        throw new appError(errMessages.join(', '), 400);
    }

    return result.data;
}