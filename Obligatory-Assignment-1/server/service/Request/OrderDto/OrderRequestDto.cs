using service.Request.CustomerDto;
using service.Request.OrderEntryDto;

namespace service.Request.OrderDto;

public class OrderRequestDto
{
    public CreateCustomerDto Customer { get; set; } = null!; // Customer details
    public CreateOrderDto Order { get; set; } = null!; // Order details
    public List<CreateOrderEntryDto> OrderEntries { get; set; } = null!;
}