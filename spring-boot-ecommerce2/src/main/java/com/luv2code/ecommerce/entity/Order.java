package com.luv2code.ecommerce.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@Column(name = "order_tracking_number")
	private String order_tracking_number;

	@Column(name = "total_price")
	private BigDecimal total_price;

	@Column(name = "total_quantity")
	private int total_quantity;
     
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "billing_address_id")
	private Address billing_address_id;

	@ManyToOne
	@JoinColumn(name = "customer_id")
	private Customer customer;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "shipping_address_id")
	private Address shipping_address_id;

	@Column(name = "status")
	private String status;

	@Column(name = "date_created")
	@CreationTimestamp
	private Date date_created;

	@Column(name = "last_updated")
	@UpdateTimestamp
	private Date last_updated;

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
	private Set<OrderItems> orderItems = new HashSet<>();

	public void add(OrderItems items) {

		if (items != null) {
			if (orderItems == null) {
				orderItems = new HashSet<>();
			}
			orderItems.add(items);
			items.setOrder(this);
		}

	}

}
