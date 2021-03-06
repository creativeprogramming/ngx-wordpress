import { Directive, EventEmitter, Output, Input } from '@angular/core';

import { WpService } from '../service/wp.service';
import { ModelService } from '../service/model/model.service';
import { ModelResponse } from '../service/model/model.interface';

@Directive({
  selector: '[wpModel]'
})
export class ModelDirective {

  private model: ModelService;
  private loading: boolean = false;

  /** Model endpoint */
  @Input('wpModel') set endpoint(endpoint) {

    this.model = <ModelService>this.wpService.model().endpoint(endpoint);
  }

  /** Model query args */
  @Input() wpArgs;

  /** Model id, new request on id changes */
  @Input() set wpId(id: number) {
    this.get(id, this.wpArgs);
  }

  /** Model response */
  @Output() wpResponse = new EventEmitter<ModelResponse>();

  /** Loading state */
  @Output() wpLoading = new EventEmitter<boolean>(false);

  constructor(private wpService: WpService) {

  }

  /** Get a model of endpoint type by id */
  get(id, args?) {
    if (!this.loading) {
      this.loading = true;
      this.wpLoading.emit(this.loading);

      this.model.get(id, args).subscribe((res) => {
        this.wpResponse.emit(res);
        this.loading = false;
        this.wpLoading.emit(this.loading);
      });
    }
  }
}
