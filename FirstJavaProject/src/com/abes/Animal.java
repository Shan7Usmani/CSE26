package com.abes;

public class Animal {
void eat()
{
	System.out.println("Animal eats food");
}
}

class Dog extends Animal{
	void bark()
	{
		System.out.println("Dog Barks");
	}
}
class TestInheritance {
	public static void main (String [] args)
	{
	Dog d =new Dog();
	d.eat();
	d.bark();
	}
}