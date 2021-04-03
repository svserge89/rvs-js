import {LocalDate} from '@js-joda/core';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import {DECIMAL_PRECISION, DECIMAL_SCALE} from '../../../utils/database';
import {DateTransformer} from '../../../utils/datetime';
import {DishEntity} from '../../dish/entity/dish.entity';
import {RestaurantEntity} from '../../entity/restaurant.entity';

@Entity({name: 'menu_entry', schema: 'public'})
@Unique(['date', 'dish', 'restaurant'])
export class MenuEntryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {name: 'id'})
  id: string;

  @Column({
    type: 'decimal',
    name: 'price',
    precision: DECIMAL_PRECISION,
    scale: DECIMAL_SCALE,
  })
  price: string;

  @Column({
    type: 'date',
    name: 'date',
    transformer: new DateTransformer(),
    default: LocalDate.now(),
  })
  date: LocalDate;

  @ManyToOne(() => DishEntity, {eager: true})
  @JoinColumn({name: 'dish_id', referencedColumnName: 'id'})
  dish: DishEntity;

  @ManyToOne(() => RestaurantEntity, {eager: false})
  @JoinColumn({name: 'restaurant_id', referencedColumnName: 'id'})
  restaurant: RestaurantEntity;
}
