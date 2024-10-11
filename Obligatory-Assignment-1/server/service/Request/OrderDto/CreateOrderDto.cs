namespace service.Request.OrderDto;

public class CreateOrderDto
{
    public DateTime OrderDate { get; set; }
    public DateOnly? DeliveryDate { get; set; } = null!;
    public string Status { get; set; } = null!;
    public double TotalAmount { get; set; }
}