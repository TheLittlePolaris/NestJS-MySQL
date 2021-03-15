import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}
	canActivate(context: ExecutionContext) {

		const roles = this.reflector.get<string[]>('roles', context.getHandler())
      
		if (!roles) {
			return true
		}
		const request = context.switchToHttp().getRequest()
		const user = request.user
        console.log(user)
		const hasRole = () => user.roles.some((role) => !!roles.find((item) => item === role))

		return user && user.roles && hasRole()
	}
}
