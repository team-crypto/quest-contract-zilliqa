FROM ocaml/opam2:ubuntu-18.04-ocaml-4.06 AS scilla-runner

USER root

RUN apt-get update
RUN apt-get install -y  m4 pkg-config zlib1g-dev libgmp-dev libffi-dev libssl-dev libboost-system-dev

USER opam

RUN opam init -y
RUN opam install -y ocaml-migrate-parsetree core cryptokit ppx_sexp_conv yojson batteries angstrom hex ppx_deriving ppx_deriving_yojson menhir oUnit dune stdint fileutils ctypes ctypes-foreign


RUN echo ". ~/.opam/opam-init/init.sh > /dev/null 2> /dev/null || true " >> ~/.bashrc
RUN echo "eval `opam config env`" >> ~/.bashrc

WORKDIR /home/opam
RUN git clone https://github.com/Zilliqa/scilla.git

WORKDIR /home/opam/scilla
RUN eval $(opam config env) && make

##############

FROM node:10.11.0-stretch

RUN mkdir /prj-dev-nagato
COPY --from=scilla-runner /home/opam/scilla/_build/install/default/bin/scilla-runner /usr/bin/
WORKDIR /prj-dev-nagato

CMD bash -c "yarn && yarn test"
