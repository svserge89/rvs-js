import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

import {NAME_LENGTH, URL_LENGTH} from '../../utils/database';

@Entity({name: 'restaurant', schema: 'public'})
export class RestaurantEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {name: 'id'})
  id: string;

  @Column({type: 'varchar', name: 'name', length: NAME_LENGTH, unique: true})
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
}
