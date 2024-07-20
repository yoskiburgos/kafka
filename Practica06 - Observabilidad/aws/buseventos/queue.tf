
data "aws_caller_identity" "current" {}


################################################################################
# Colas
################################################################################

resource "aws_sqs_queue" "sqs_queue" {
  name                       = "prueba-cola-sqs"
  visibility_timeout_seconds = 300
}


resource "aws_iam_role" "lambda_sqs" {
  name               = "prueba-sqs-rol"
  assume_role_policy = data.aws_iam_policy_document.sqs_assume_role.json
}

data "aws_iam_policy_document" "sqs_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }
  }
}







resource "aws_sqs_queue_policy" "sqs_queue_policy" {
  queue_url = aws_sqs_queue.sqs_queue.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {

      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
      },
      "Action": "SQS:*",
      "Resource": "${aws_sqs_queue.sqs_queue.arn}"
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "events.amazonaws.com"
      },
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.sqs_queue.arn}",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${aws_cloudwatch_event_rule.event_rule.arn}"
        }
      }
    }
  ]
}
EOF
}



