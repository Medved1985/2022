import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb'

export function grpcBoolObject(value: boolean): google_protobuf_wrappers_pb.BoolValue{
  const res = new google_protobuf_wrappers_pb.BoolValue();
  res.setValue(value);
  return res;
}
export function grpcStringObject(value: string): google_protobuf_wrappers_pb.StringValue{
  const res = new google_protobuf_wrappers_pb.StringValue();
  res.setValue(value);
  return res;
}
export function grpcUInt32ValueObject(value: string): google_protobuf_wrappers_pb.UInt32Value{
  const res = new google_protobuf_wrappers_pb.UInt32Value();
  res.setValue(value);
  return res;
}

export function grpcInt32ValueObject(value: string): google_protobuf_wrappers_pb.Int32Value{
  const res = new google_protobuf_wrappers_pb.Int32Value();
  res.setValue(value);
  return res;
}

export function grpcInt64ValueObject(value: string): google_protobuf_wrappers_pb.Int64Value{
  const res = new google_protobuf_wrappers_pb.Int64Value();
  res.setValue(value);
  return res;
}