import { Injectable, EnvironmentInjector, createComponent, ApplicationRef } from '@angular/core'
import { ConfirmDialogComponent } from '../components/confirm/confirm.component'

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  constructor(private environmentInjector: EnvironmentInjector, private appRef: ApplicationRef) {}

  async confirm(message: string): Promise<boolean> {
    const componentRef = createComponent(ConfirmDialogComponent, {
      environmentInjector: this.environmentInjector
    })
    document.body.appendChild(componentRef.location.nativeElement)
    this.appRef.attachView(componentRef.hostView)
    this.appRef.tick()

    const result = await componentRef.instance.confirm(message)

    componentRef.destroy()
    return result
  }
}
