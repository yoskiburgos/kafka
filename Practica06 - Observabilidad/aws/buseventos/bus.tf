################################################################################
# Bus Event Bridge
################################################################################


resource "aws_cloudwatch_event_bus" "event_bus" {

  name = "bus-prueba"
}
