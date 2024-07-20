################################################################################
# Rules Event Bridge
################################################################################

resource "aws_cloudwatch_event_rule" "event_rule" {
  name           = "rule-prueba-sqs"
  description    =  "rule-prueba-sqs"
  event_bus_name = "bus-prueba"

  event_pattern = <<EOF
    {
    "source": ["*"]
    }
    EOF

  depends_on = [aws_cloudwatch_event_bus.event_bus]
}



resource "aws_cloudwatch_event_target" "event_target" {
  rule      = aws_cloudwatch_event_rule.event_rule.name
  arn       = aws_sqs_queue.sqs_queue.arn
  target_id = "fn-lambda"

  event_bus_name = "bus-prueba"
}

