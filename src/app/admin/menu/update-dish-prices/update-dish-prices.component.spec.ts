import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDishPricesComponent } from './update-dish-prices.component';

describe('UpdateDishPricesComponent', () => {
  let component: UpdateDishPricesComponent;
  let fixture: ComponentFixture<UpdateDishPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDishPricesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateDishPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
