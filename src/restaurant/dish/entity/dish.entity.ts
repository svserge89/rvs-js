import {LocalDate} from '@js-joda/core';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';

import {NAME_LENGTH, URL_LENGTH} from '../../../utils/database';
import {DateTransformer} from '../../../utils/datetime';
import {RestaurantEntity} from '../../entity/restaurant.entity';

@Entity({name: 'dish', schema: 'public'})
@Unique(['name', 'date', 'restaurant'])
export class DishEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {name: 'id'})
  id: string;

  @Column({type: 'varchar', name: 'name', length: NAME_LENGTH})
  name: string;

  @Column({type: 'text', name: 'description', nullable: true})
  description: string;

  @Column({
    type: 'varchar',
    name: 'image_url',
    length: URL_LENGTH,
    nullable: true,
  })
  imageUrl: string;

  @Column({
    type: 'date',
    name: 'date',
    transformer: new DateTransformer(),
    default: LocalDate.now(),
  })
  date: LocalDate;

  @ManyToOne(() => RestaurantEntity, {eager: false})
  @JoinColumn({name: 'restaurant_id', referencedColumnName: 'id'})
  restaurant: RestaurantEntity;

  @RelationId((dish: DishEntity) => dish.restaurant)
  restaurantId: string;
}
