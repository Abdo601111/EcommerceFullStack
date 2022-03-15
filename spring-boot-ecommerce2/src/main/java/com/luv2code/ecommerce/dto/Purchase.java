package com.luv2code.ecommerce.dto;

import java.util.HashSet;
import java.util.Set;

import com.luv2code.ecommerce.entity.Address;
import com.luv2code.ecommerce.entity.Customer;
import com.luv2code.ecommerce.entity.Order;
import com.luv2code.ecommerce.entity.OrderItems;

import lombok.Data;

@Data
public class Purchase {
	
	private Customer customer;
	
	private Address shippingAddress;
	
	private Address BillingAddress;
	
	private Order order;
	
	private Set<OrderItems> orderItems= new HashSet<>(); 

}
